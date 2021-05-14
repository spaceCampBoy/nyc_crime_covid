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
export default function MainLineChart({ data, play, setPlay, filters, setNewsDate, reset, setReset, speed }) {
	const [lines, setlines] = useState([{ key: "ARREST_COUNT_7DAY_AVG", name: "NYC", color: "#fcba03" }])
	// const domainFixed = [
	// 	moment('2020-01-01').valueOf(),
	// 	moment('2020-12-31').valueOf()
	// ];
	const domainFluid = ["auto", "auto"];
	const [domain, setDomain] = useState(domainFluid)
	const [animation, setAnimation] = useState(true)
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
					const next = data[p.length];
					if(next)
					{
						filterNewsDate(next.date);
					}
					return [
						...p,
						next,
					]
				})
			}, speed * 1000)
		}
	}, [points, setPoints])

	useEffect(() => {
		if(reset)
		{
			setDomain(domainFluid);
			setAnimation(true);
			setPoints(data);
			setReset(false);
			setPlay(false);
		}
		else{
			if (play && points.length === data.length) {
				// setDomain(domainFixed);
				setAnimation(false);
				setPoints([]);
			}
			else if(play)
			{
				setPoints(p => {
					const next = data[p.length];
					filterNewsDate(next.date);
					return [
						...p,
						next,
					]
				})
			}
		}
	}, [play, reset])

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
				return "Covid Cases 7-Day AVG: " + cases;
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
		// if (m.month() === 0) {
		// 	return m.format("MMM, YYYY");
		// }
		return m.format("Do MMM, YY");
	};

	const brushFormatDateTick = (args) => {
		const time = data[args].date;
		return moment(time).format("Do MMM, YY");
	};

	const [fixedNewsFilter, setFixedNewsFilter] = useState(null)

	const onClick = (args) => {
		if(args)
		{
			if (args.activeLabel) {
				setFixedNewsFilter(args.activeLabel);
			}
		}
		console.log(args)
	}

	const filterNewsDate = (time) => {
		const m = moment(time);
		setNewsDate(m.format("YYYY-MM-DD"));
	}
	
	const onMove = (args) => {
		if (args.isTooltipActive) {
			filterNewsDate(args.activeLabel);
		}
	} 
	
	const onLeave = (args) => {
		if(fixedNewsFilter)
		{
			filterNewsDate(fixedNewsFilter);
		}
	} 

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				width={550}
				height={300}
				data={points}
				margin={{
					top: 10,
					right: 10,
					left: 10,
					bottom: 0,
				}}
				onClick={onClick}
				onMouseMove={onMove}
				onMouseLeave={onLeave}
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
				<YAxis yAxisId="left" label={{ value: 'Arrests Count', angle: -90, position: 'insideRight' ,offset:50}}/>
				<YAxis yAxisId="right" orientation="right" label={{ value: 'Covid Cases', angle: -90, position:'insideRight' }} />
				<Tooltip labelFormatter={tooltipFormater} />
				<Legend />
				{
					lines.map((line) => {
						return <Line
							key={line.key}
							strokeWidth="3px"
							yAxisId="left"
							type="monotone"
							name={line.name + " Arrests Count 7-Day Average"}
							dataKey={line.key}
							stroke={line.color}
							dot={false}
							isAnimationActive={animation}
						/>
					})
				}
				<Line
					key="covid"
					strokeWidth="3px"
					yAxisId="right"
					type="monotone"
					name="Covid Confirmed Cases 7-Day AVG"
					dataKey="COVID_COUNT_7DAY_AVG"
					stroke="#fc0703"
					dot={false}
					isAnimationActive={animation}
				/>

				<Brush tickFormatter={brushFormatDateTick} />
			</LineChart>
		</ResponsiveContainer>
	);
}
