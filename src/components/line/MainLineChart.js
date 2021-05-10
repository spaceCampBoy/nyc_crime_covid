import React, { useEffect, useState } from "react";
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
import boro_names_acronyms from "../../data/boro_name_acronym.json";
import selected_colors from "../../data/boroColors_selected.json";
export default function MainLineChart({ data, play, setPlay, filters }) {
	const [lines, setlines] = useState([{ key: "ARREST_COUNT_7DAY_AVG", name: "NYC", color: "#fcba03" }])
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

	}, [filters.filters, filters.filtersChanged])

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
			if (cases !== '' || cases === 0) {
				return "7-Day Avg: " + cases;
			}
			return '';
		}
		const getFontSize = () => {
			if (width > 700) {
				return 40;
			}
			else if (width > 600) {
				return 30;
			}
			else if(width > 500)
			{
				return 25;
			}
			else
			{
				return 20;
			}
		}

		const fontSize = getFontSize();
		return (
			<svg version="1.1"
				baseProfile="full"
				width={width} height={height}
				xmlns="http://www.w3.org/2000/svg">
				<text x={width / 2 - fontSize} y={height / 2 - fontSize} fontSize={fontSize} textAnchor="middle" fill="lightgray">{currentDate}</text>
				<text x={width / 2 - fontSize} y={height / 2} fontSize={fontSize} textAnchor="middle" fill="lightgray">{getAvgCasesString()}</text>
			</svg>
		)
	}

	const tooltipFormater = (time) => {
		return moment(time).format("Do [of] MMMM, YYYY");
	};

	const formatDateTick = (time) => {
		const m = moment(time);
		if (m.month() === 0) {
			return m.format("MMM, YYYY");
		}
		return m.format("MMM");
	};

	const brushFormatDateTick = (args) => {
		const time = data[args].date;
		return moment(time).format("Do MMM, YY");
	};

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				width={550}
				height={300}
				data={points}
				margin={{
					top: 10,
					right: 0,
					left: 0,
					bottom: 0,
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
