import React, {useState} from "react";

import { covid_cases_7day_avg } from "./data/covid";
import { nyc_borough_geo } from "./data/nycGeo";

import CovidLine from "./components/line/covidLine";

import useTimer from "./hooks/useTimer/useTimer";
import {convertDateToYearMonthDayString} from "./utils/dateUtils";

import "./App.css";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
} from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/Stop';


function App() {
  const [play, setPlay] = useState(false);
  const covid_cases = covid_cases_7day_avg
    .map( row => ({x: new Date(row.date), y:row.ALL_CASE_COUNT_7DAY_AVG}))
    .sort((a,b) => a.x < b.x)
  const timer = useTimer({
    startTime: new Date(covid_cases[0].x),
    endTime: new Date(covid_cases[covid_cases.length - 1].x),
    step: 1000 * 60 * 60,
    frequency: 24 * 7,
  })

  console.log(nyc_borough_geo)
  const covid_data = {
    id: "Covid Cases 7 Day Average",
    color: "hsl(315, 70%, 50%)",
    data: covid_cases.map(row => ({ ...row, x: convertDateToYearMonthDayString(row.x)}))
  }

  return (
    <Grid container justify="center" alignItems="center" align="center" >
      <Grid item><h1>NYC Crimes and Covid</h1></Grid>
      <Grid item container xs={12} className="covid_line_chart" direction="row">
        <Grid item xs={12}>
          <CovidLine data={[covid_data]} play={play}></CovidLine>
        </Grid>
        {/* <Grid item xs={6}>
          <CovidLine data={[covid_data]} play={play}></CovidLine>
        </Grid> */}
      </Grid>
      <Grid item xs={12}>
        <IconButton color="primary" aria-label="upload picture" component="span" onClick={() => setPlay(!play)}>
          {!play ? <PlayCircleOutlineIcon fontSize="large" /> : <StopIcon fontSize="large" />}
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default App