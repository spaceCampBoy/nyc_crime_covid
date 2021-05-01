/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react"
import { scaleTime, scaleLinear, extent, line, area, curveBasis, axisBottom, axisLeft, select } from "d3"
import useWindowDimensions from "../../hooks/useWindowDimensions/useWindowDimensions"
import drawTooltip from '../tooltip/tooltip';
import "./trend.css";

export default function Trend({ data, time, startTime, endTime, updateTime }) {
    const { windowHeight, windowWidth } = useWindowDimensions();

    /** Trend dimensions */
    const width = windowWidth * 0.9
    const height = windowHeight * 0.5

    /** Axes and plot dimensions */
    const yAxisWidth = 40
    const xAxisHeight = 15
    const plotWidth = width - yAxisWidth
    const plotHeight = height - xAxisHeight

    const createNewXScale = () => {
        const xScale = scaleTime()
            .domain([startTime, endTime])
            .range([0, plotWidth]);
        return xScale
    }

    const createNewYScale = () => {
        const yScale = scaleLinear()
            .domain(extent(data.map(d => d.y)))
            .range([plotHeight, 0]);
        return yScale;
    }
    /** area and line paths define the paths data */
    const [xScale, setXScale] = useState(createNewXScale);

    const [yScale, setYScale] = useState(createNewYScale);

    useEffect(() => {
        setXScale(createNewXScale);
        setYScale(createNewYScale);
        generateNewArea();
        generateNewLine();
        createXAxis();
        createYAxis();
    }, [windowHeight, windowWidth])

    /** area and line paths define the paths data */
    const [areaPath, setAreaPath] = useState(null)
    const [linePath, setLinePath] = useState(null)

    const generateNewArea = () => {
        /** generate a new area */
        const areaPathGenerator = area()
            .x(d => xScale(d.x))
            .y0(yScale.range()[0])
            .y1(d => yScale(d.y))
            .curve(curveBasis)

        setAreaPath(areaPathGenerator(data))
    }

    const generateNewLine = () => {
        /** generate a new line */
        const linePathGenerator = line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(curveBasis)

        setLinePath(linePathGenerator(data))
    }

    /** When data changes.. */
    useEffect(() => {
        generateNewArea();
        generateNewLine();
    }, [data])

    /** This is the time span of the current time based on the timer */
    const [selectedWidth, setSelectedWidth] = useState(0)
    useEffect(() => {
        setSelectedWidth(xScale(time))
    }, [time.valueOf()])

    /** Ref to xAxis */
    const xAxisRef = useRef()
    const createXAxis = () => {
        if (xAxisRef) {
            /** Get xAxis */
            const xAxisGroup = select(xAxisRef.current)

            /** Create axis */
            const xAxis = axisBottom()
                .scale(xScale)
                .tickSize(0)

            /** Attach axis to group */
            xAxisGroup.call(xAxis)
        }
    }
    useEffect(() => {
        createXAxis();
    }, [xAxisRef])

    /** Ref to yAxis */
    const yAxisRef = useRef()
    const createYAxis = () => {
        if (yAxisRef) {
            /** Get yAxis */
            const yAxisGroup = select(yAxisRef.current)

            /** Create axis */
            const yAxis = axisLeft()
                .scale(yScale)
                .tickSize(-plotWidth)
                .ticks(6)

            /** Attach axis to group */
            yAxisGroup.call(yAxis)
        }
    }

    useEffect(() => {
        createYAxis();
    }, [yAxisRef])

    /** Update time when click on svg */
    const svgRef = useRef()
    const handlePlotClick = evt => {
        /** Get the svg's left position on the page */
        const { left } = svgRef.current.getBoundingClientRect()
        /** Get the relative click position by subtracting the svg's left position and yAxisWidth from the click
         * position */
        const clickX = evt.clientX - left - yAxisWidth
        /** Pass the relative click position through the xScale invert function to get the appropriate date */
        updateTime(xScale.invert(clickX >= 0 ? clickX : 0))
    }

    const tooltipRef = useRef()

    const gRef = useRef()
    const makeTooltip = ()  => drawTooltip({
        svgRef: gRef,
        tooltipRef,
        data,
        xScale,
        yScale,
        margin: { top: 10, bottom: 10, left: 10, right: 10 },
        width,
        height
    });

    useEffect(() => {
        makeTooltip();
    }, [tooltipRef])

    return (
        <>
            <svg ref={svgRef} width={width} height={height} onClick={handlePlotClick}>
                <defs>
                    <clipPath id="selected-region">
                        <rect x={0} y={0} width={selectedWidth} height={height} />
                    </clipPath>
                </defs>
                <g ref={yAxisRef} className="trend__y-axis trend__axis" transform={`translate(${yAxisWidth}, 0)`} />
                <g className="trend__plot" transform={`translate(${yAxisWidth}, 0)`}>
                    <g ref={gRef}>
                        {areaPath !== null ? <path d={areaPath} className="trend__base-area" /> : null}
                        {linePath !== null ? <path d={linePath} className="trend__base-line" /> : null}
                    </g>
                    <g clipPath={"url(#selected-region)"}>
                        {areaPath !== null ? <path d={areaPath} className="trend__area" /> : null}
                        {linePath !== null ? <path d={linePath} className="trend__line" /> : null}
                    </g>
                </g>
                <g ref={xAxisRef} className="trend__x-axis trend__axis" transform={`translate(${yAxisWidth}, ${plotHeight})`} />
            </svg>
            <div className='base__tooltip' ref={tooltipRef} />
        </>
    )
}