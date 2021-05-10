import React, { useState, useRef } from "react";
import useFilters from "./hooks/useFilters/useFilters";

import MainLineChart from "./components/line/MainLineChart";
import FocusCrimes from "./components/bars/FocusCrimes";
import NYCMap from "./components/nycMap/NYCMap";

import { Grid, Paper, Typography, IconButton } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/Stop';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import "./App.css";

import arrest_covid_merged from "./data/arrest_covid_merged.json";

function App() {

  const [play, setPlay] = useState(false);

  const filters = useFilters();

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
      <Grid container justify="center" alignItems="flex-start" align="center">

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

        <Grid item xs={12} md={12}>
          <IconButton color="primary" component="span" onClick={scrollDown}>
            <KeyboardArrowDownIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item ref={barChartsRef} xs={12}>
          <FocusCrimes />
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default App