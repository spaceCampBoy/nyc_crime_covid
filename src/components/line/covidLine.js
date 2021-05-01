// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { Line, ResponsiveLine } from '@nivo/line'
import React, { useEffect, useState, useRef } from "react"
import { convertDateToYearMonthDayString } from "../../utils/dateUtils"
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default function CovidLine ({ data /* see data tab */, play }){ 
    const [points, setPoints] = useState(data[0].data.slice(0,1))

    useEffect(() => {
        if(play)
        {
            if (points.length === data[0].data.length ) return
    
            setTimeout(() => {
                setPoints(p => {
                    if (p.length === data[0].data.length) return p
                    const next = data[0].data[p.length]
    
                    return [
                        ...p,
                        next,
                    ]
                })
            }, 200)
        }
    }, [points, setPoints, play])

    const newData = [data[0],
    {
        id: "Covid Cases 7 Day Average Historical",
        color: "hsl(19, 70%, 50%)",
        data: points
    }]

    const commonProperties = {
        width: 800,
        height: 400,
        margin: { top: 20, right: 20, bottom: 60, left: 60 },
        data : newData,
        animate: true,
        enableSlices: 'x',
    }

    const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
        <g>
            <circle fill="#fff" r={size / 8} strokeWidth={borderWidth} stroke={borderColor} />
            <circle
                r={size / 5}
                strokeWidth={borderWidth}
                stroke={borderColor}
                fill={color}
                fillOpacity={0.35}
            />
        </g>
    )
    const CurrentDateLayer = ({ series, xScale, yScale, innerHeight }) => {
        const getCurrentDateOfTimeLapse = (series) => {
            const timelapseSeries = series[1].data;
            if(timelapseSeries)
            {
                const currentRow = timelapseSeries[timelapseSeries.length - 1];
                if (currentRow && currentRow.data && currentRow.data.x)
                {
                    return [convertDateToYearMonthDayString(currentRow.data.x), currentRow.data.y];
                }
            }
            return ['',''];
        }
        const [currentDate, cases ]= getCurrentDateOfTimeLapse(series)
        const getAvgCasesString = () =>
        {
            if(cases != '')
            {
                return "7-Day Avg: " + cases;
            }
            return '';
        }
        return (
            <svg version="1.1"
                baseProfile="full"
                width={commonProperties.width} height={commonProperties.height}
                xmlns="http://www.w3.org/2000/svg">
                <text x={commonProperties.width / 2 - 50} y={commonProperties.height / 2 - 50} font-size="50" text-anchor="middle" fill="lightgray">{currentDate}</text>
                <text x={commonProperties.width / 2 - 50} y={commonProperties.height / 2} font-size="50" text-anchor="middle" fill="lightgray">{getAvgCasesString()}</text>
            </svg>
        )
    }

    return (
        <ResponsiveLine
            {...commonProperties}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
                type: 'linear',
                stacked: false,
            }}
            axisLeft={{
                legend: '7-Day Average',
                legendOffset: -50,
                legendPosition: 'middle'
            }}
            axisBottom={{
                format: '%b %d',
                tickValues: 'every 1 month',
                legend: 'Date',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            enablePoints={false}
            curve='cardinal'
            enablePointLabel={true}
            pointSymbol={CustomSymbol}
            pointSize={5}
            pointBorderWidth={1}
            pointBorderColor={{
                from: 'color',
                modifiers: [['darker', 0.3]],
            }}
            layers={[
                CurrentDateLayer,
                'grid',
                'markers',
                'areas',
                'lines',
                'slices',
                'axes',
                'points',
                'legends',
                'crosshair',
                'mesh'
            ]}
            useMesh={true}
            enableSlices={false}
            enableArea={true}
        />
)}