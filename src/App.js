import React, { useState, useRef } from "react";

import covid_cases_7day_avg from "./data/covid/covid_cases_7day_avg.json";
import covid_cases_2019_2020 from "./data/covid/covid_cases_2019_2020.json";
import arrest_2019_2020 from "./data/crimeData/arrest_data_2019_2020.json";
import arrest_covid_merged from "./data/arrest_covid_merged.json";

import MainLineChart from "./components/line/MainLineChart";
import NYCMap from "./components/nycMap/NYCMap";

import useTimer from "./hooks/useTimer/useTimer";
import useFilters from "./hooks/useFilters/useFilters";
import { convertDateToYearMonthDayString } from "./utils/dateUtils";

import { Button, Grid, Paper, TextField, Typography, IconButton } from "@material-ui/core";
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/Stop';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import "./App.css";

function App() {

  const [play, setPlay] = useState(false);

  const jan2021date = new Date("01-01-2021");
  const covid_cases = covid_cases_2019_2020
    .map(row => ({ x: new Date(row.date), y: row.ALL_CASE_COUNT_7DAY_AVG }))
    .sort((a, b) => a.x < b.x).filter(row => row.x < jan2021date)

  const arrests_cases = arrest_2019_2020
    .map(row => ({ x: new Date(row.ARREST_DATE), y: row.COUNT_SMA_7 }))
    .sort((a, b) => a.x < b.x)

  const timer = useTimer({
    startTime: new Date(covid_cases[0].x),
    endTime: new Date(covid_cases[covid_cases.length - 1].x),
    step: 1000 * 60 * 60,
    frequency: 24 * 7,
  });

  const filters = useFilters();

  const covid_data = {
    id: "Covid Cases 7 Day Average",
    color: "hsl(315, 70%, 50%)",
    data: covid_cases.map(row => ({ ...row, x: convertDateToYearMonthDayString(row.x) }))
  }

  const arrests_data = {
    id: "Arrests Cases 7 Day Average",
    color: "hsl(215, 70%, 50%)",
    data: arrests_cases.map(row => ({ ...row, x: convertDateToYearMonthDayString(row.x) }))
  }

  const arrests_covid_data = arrest_covid_merged

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#ff4400',
      },
      secondary: {
        light: '#0066ff',
        main: '#0044ff',
        contrastText: '#ffcc00',
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });
  const barChartsRef = useRef()

  const scrollDown = () => {
    barChartsRef.current.scrollIntoView({
      behavior: "smooth"
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" align="center" xs={12} md={12}>

        <Grid item container justify="space-between" alignItems="stretch" xs={12} md={2} spacing={2} direction="column">
          <Grid item>
            <Typography variant="h4">NYC Crimes and Covid</Typography>
          </Grid>
          <Grid item xs={12} md={12} >
            <Paper className="filter_options">
              <NYCMap data={[]} setFilters={filters.updateFilters} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper >
              <IconButton color="primary" component="span" onClick={() => setPlay(!play)}>
                {!play ? <PlayCircleOutlineIcon fontSize="large" /> : <StopIcon fontSize="large" />}
              </IconButton>
            </Paper>
          </Grid>
        </Grid>

        <Grid item container xs={12} md={10} justify="center">
          <Grid item xs={12} md={12} className="main_line_chart" >
            <MainLineChart data={arrests_covid_data} play={play} setPlay={setPlay} filters={filters}></MainLineChart>
          </Grid>
        </Grid>
        <Grid item>
            <IconButton color="primary" component="span" onClick={scrollDown}>
              <KeyboardArrowDownIcon fontSize="large" />
            </IconButton>
        </Grid>
        <Grid container ref={barChartsRef} justify="center" alignItems="center" align="center" direction="column" xs={12}>
          <Grid item >
            <Typography variant="h4">Most Effected Categories</Typography>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default App