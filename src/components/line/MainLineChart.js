import React, { useEffect, useState, useRef } from "react";
import { filter } from "d3-array";
import moment from "moment";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Brush,
	Customized
} from "recharts";
import { convertDateToYearMonthDayString } from "../../utils/dateUtils";
import boro_names_acronyms from "../../data/boro_name_acronym.json";
import selected_colors from "../../data/boroColors_selected.json";
export default function MainLineChart({ data, play, setPlay, filters }) {
	const [lines, setlines] = useState([{ name: "ARREST_COUNT_7DAY_AVG", color: "#fcba03" }])
	const domainFixed = [
		moment('2019-01-01').valueOf(),
		moment('2020-12-31').valueOf()
	];
	const domainFluid = ["auto", "auto"];
	const [domain, setDomain] = useState(domainFluid)

	const filterLines = (filters) => {
		const filtered_lines = [];

		for (const prop in filters) {
			if (filters[prop]) {
				filtered_lines.push(
					{
						key: "ARREST_COUNT_7DAY_AVG_" + boro_names_acronyms[prop],
						name: prop,
						color: selected_colors[prop]
					});
			}
		}

		if (filtered_lines.length === 0) {
			filtered_lines.push({ key: "ARREST_COUNT_7DAY_AVG", name: "NYC", color: "#fcba03" });
		}
		setlines(filtered_lines);
	}

	useEffect(() => {
		filterLines(filters.filters)

	}, [filters.filtersChanged])

	const [points, setPoints] = useState(data)

	useEffect(() => {
		if (play) {
			if (points.length === data.length) {
				setPlay(!play);
				return;
			}

			setTimeout(() => {
				setPoints(p => {
					if (p.length === data.length) {
						setPlay(!play);
						return p;
					}
					const next = data[p.length]

					return [
						...p,
						next,
					]
				})
			}, 50)
		}
	}, [points, setPoints])

	useEffect(() => {
		if (play) {
			setDomain(domainFixed);
			setPoints([]);
		}
		else {
			setDomain(domainFluid);
			setPoints(data);
		}
	}, [play])

	// const newData = [data[0],
	// {
	//     id: "Covid Cases 7 Day Average Historical",
	//     color: "hsl(19, 70%, 50%)",
	//     data: points
	// }, data[1]]

	// const commonProperties = {
	//     height: 400,
	//     margin: { top: 20, right: 50, bottom: 60, left: 60 },
	//     data : newData,
	//     animate: true,
	//     enableSlices: 'x',
	// }

	// const commonProperties1 = {
	//     width: 800,
	//     height: 400,
	//     margin: { top: 20, right: 50, bottom: 60, left: 60 },
	//     data: newData,
	//     animate: true,
	//     enableSlices: 'x',
	// }

	// const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
	//     <g>
	//         <circle fill="#fff" r={size / 8} strokeWidth={borderWidth} stroke={borderColor} />
	//         <circle
	//             r={size / 5}
	//             strokeWidth={borderWidth}
	//             stroke={borderColor}
	//             fill={color}
	//             fillOpacity={0.35}
	//         />
	//     </g>
	// )
	const currentDateLayer = ({ data, width, height }) => {
		const getCurrentDateOfTimeLapse = (data) => {
			const row = data[data.length - 1];
			if (row) {
				return [tooltipFormater(row.date), row["COVID_COUNT_7DAY_AVG"]];
			}
			return ['', ''];
		}
		const [currentDate, cases] = getCurrentDateOfTimeLapse(data)
		const getAvgCasesString = () => {
			if (cases != '' || cases == 0) {
				return "7-Day Avg: " + cases;
			}
			return '';
		}
		return (
			<svg version="1.1"
				baseProfile="full"
				width={width} height={height}
				xmlns="http://www.w3.org/2000/svg">
				<text x={width / 2 - 50} y={height / 2 - 50} fontSize="50" textAnchor="middle" fill="lightgray">{currentDate}</text>
				<text x={width / 2 - 50} y={height / 2} fontSize="50" textAnchor="middle" fill="lightgray">{getAvgCasesString()}</text>
			</svg>
		)
	}



	const generateTicks = (start, end) => { };

	const tooltipFormater = (time) => {
		return moment(time).format("Do [of] MMMM, YYYY");
	};

	const formatDateTick = (time) => {
		const m = moment(time);
		if (m.month() == 0) {
			return m.format("MMM, YYYY");
		}
		return m.format("MMM");
	};

	const brushFormatDateTick = (args) => {
		const time = data[args].date;
		return moment(time).format("Do MMM, YY");
	};

	const customElement = (args) => {
		console.log(args);
		return <div></div>
	}

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				width={500}
				height={300}
				data={points}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<Customized key="date_background" component={currentDateLayer} />
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="date"
					scale="time"
					type="number"
					tickFormatter={formatDateTick}
					domain={domain}
					minTickGap={30}
				/>
				<YAxis yAxisId="left" />
				<YAxis yAxisId="right" orientation="right" />
				<Tooltip labelFormatter={tooltipFormater} />
				<Legend />
				{
					lines.map((line) => {
						return <Line
							key={line.key}
							strokeWidth="3px"
							yAxisId="left"
							type="monotone"
							name={line.name}
							dataKey={line.key}
							stroke={line.color}
							dot={false}
						/>
					})
				}
				<Line
					key="covid"
					strokeWidth="3px"
					yAxisId="right"
					type="monotone"
					name="Covid Cases 7Day AVG"
					dataKey="COVID_COUNT_7DAY_AVG"
					stroke="#fc0703"
					dot={false}
				/>

				<Brush tickFormatter={brushFormatDateTick} />
			</LineChart>
		</ResponsiveContainer>
	);
}
