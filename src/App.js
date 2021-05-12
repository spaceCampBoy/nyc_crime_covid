import React, { useState, useRef } from "react";
import useFilters from "./hooks/useFilters/useFilters";

import MainLineChart from "./components/line/MainLineChart";
import FocusCrimes from "./components/bars/FocusCrimes";
import NYCMap from "./components/nycMap/NYCMap";

import { Grid, Paper, Typography, IconButton } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ResetIcon from '@material-ui/icons/RotateLeftOutlined';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import "./App.css";

import arrest_covid_merged from "./data/arrest_covid_merged.json";
import NewsWindow from "./components/news/NewsWindow";
import Slider from '@material-ui/core/Slider';

function App() {

  const [play, setPlay] = useState(false);
  const [reset, setReset] = useState(false);
  const [newsDate, setNewsDate] = useState("2020-12-28")

  const filters = useFilters();

  const dec_31_2019 = 1577750400000;
  const arrests_covid_data = arrest_covid_merged.filter(e => e.date > dec_31_2019);

  const theme = createMuiTheme({
    // palette: {
    //   primary: {
    //     main: '#ff4400',
    //   },
    //   secondary: {
    //     light: '#0066ff',
    //     main: '#0044ff',
    //     contrastText: '#ffcc00',
    //   },
    //   contrastThreshold: 3,
    //   tonalOffset: 0.2,
    // },
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

  const [sliderSpeed, setSliderSpeed] = useState(1.0)

  function valuetext(value) {
    return `${value} Seconds`;
  }

  const sliderValueChanged = (event, newValue) => {
    setSliderSpeed(newValue);
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container justify="center" alignItems="flex-start" align="center" spacing={1}>

        <Grid item container justify="center" alignItems="stretch" xs={12} md={12} spacing={2} >
          <Grid item xs={12} md={8} className="main_text">
            <Typography variant="h4">Crimes in New York City and Covid-19</Typography>
            <Typography>
              COVID-19 has had a big impact on the day-to-day life of a big part of the population worldwide.
              Many social aspects have been affected due to various kinds of restrictions and lockdowns.
              With the help of <a target='_blank' rel="noreferrer" href="https://data.cityofnewyork.us/Public-Safety/NYPD-Arrests-Data-Historic-/8h9b-rp9u">NYPD Arrest data</a>,
               <a target='_blank' rel="noreferrer" href="https://www1.nyc.gov/site/doh/covid/covid-19-data.page"> New York City Covid data</a>,
              and news articles from the <a target='_blank' rel="noreferrer" href="https://www.nytimes.com/">New York Times</a>,
              this site aims to raise awareness about the effects of covid-19 on crimes in New York City.
            </Typography>
            <Typography>
              <b>The line chart</b> shows the 7-day average for New York City arrest counts and confirmed covid cases.
              <b> Hover on chart</b>, to see the news about covid-19 or crimes under the section New York Times. <b>The map of New York City</b> can be used to filter borough data.
              Finally, <b>the play button</b> animates the line chart.
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Paper className="filter_options">

              <Grid contianer justify="center" alignItems="center" alignContent="stretch" align="center" direction="row">

                <Grid item xs={12} md={12} className="slider">
                  <Typography id="discrete-slider" gutterBottom>
                    Speed in Seconds
                  </Typography>
                  <Slider
                    value={sliderSpeed}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.5}
                    marks={true}
                    min={0.5}
                    max={10}
                    onChange={sliderValueChanged}
                  />

                <Grid item xs={12} md={12}>
                  <IconButton className="play" color="primary" component="span" onClick={() => setPlay(!play)}>
                    {!play ? <PlayCircleOutlineIcon className="play_button" /> : <PauseIcon className="play_button" />}
                  </IconButton>

                  <IconButton className="play" color="primary" component="span" onClick={() => setReset(!reset)}>
                    <ResetIcon className="reset_button" />
                  </IconButton>
                </Grid>
                </Grid>

              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2} >
            <Paper className="filter_options">
              <NYCMap data={[]} setFilters={filters.updateFilters} />
            </Paper>
          </Grid>
        </Grid>

        <Grid item container xs={12} md={12} justify="center">
          <Grid item xs={12} md={8} className="main_line_chart" >
            <MainLineChart data={arrests_covid_data} play={play} setPlay={setPlay} reset={reset} setReset={setReset} filters={filters} setNewsDate={setNewsDate} speed={sliderSpeed}></MainLineChart>
          </Grid>
          <Grid item xs={12} md={4} >
            <NewsWindow newsDate={newsDate}></NewsWindow>
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