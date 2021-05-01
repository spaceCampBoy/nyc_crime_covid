import * as d3 from 'd3';
import classnames from 'classnames';
import { scaleBandInvert } from '../../utils/invertScale';
import "./tooltip.css";

function drawTooltip(config) {
    const {
        useScaleBands,
        margin,
        width,
        height,
        data,
        svgRef,
        tooltipRef,
        markerClass,
        xScale,
        yScale,
        findHoverData,
    } = config;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const focus = svg
        .append('g')
        .attr('class', 'focus')
        .style('display', 'none');

    focus
        .append('circle')
        .attr('r', 5)
        .attr('class', classnames(['line-chart__circle', markerClass]));

    if (useScaleBands) focus.style('visibility', 'hidden');

    svg
        .append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .style('opacity', 0)
        .on('mouseover', () => {
            focus.style('display', null);
        })
        .on('mouseout', () => {
            focus.style('opacity', 0);
            tooltip
                .transition()
                .duration(300)
                .style('opacity', 0);
        })
        .on('mousemove', mousemove);

    function mousemove(event) {
        const bisect = d3.bisector((d) => d.x).left;
        const xPos = d3.pointer(event)[0];
        const invertedPoint = useScaleBands ? scaleBandInvert(xScale, xPos) : xScale.invert(xPos);
        const x0 = bisect(data, invertedPoint);
        const d0 = findHoverData ? findHoverData(d3.pointer(this), height, data, xScale, yScale) : data[x0];

        focus.style('opacity', 1);

        focus.attr(
            'transform',
            `translate(${xScale(d0.x)},${yScale(d0.y)})`,
        );

        tooltip
            .transition()
            .duration(300)
            .style('opacity', 0.9);

        tooltip
            .html(`<p>Date: ${d0.x.getDate()}/${d0.x.getMonth() + 1}/${d0.x.getFullYear()}</p>
            <p>7-Day Average Cases: ${d0.y}</p>`)
            .style(
                'transform',
                `translate(${xScale(d0.x)},${yScale(d0.y)})`,
            )
            .style(
                'left',
                `${xScale(d0.x)  + 120}px`,
            )
            .style(
                'top',
                `${yScale(d0.y) + 150}px`,
            );
    }
}

export default drawTooltip;