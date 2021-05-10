import React from "react";
import focus_crimes from "../../data/crimeData/focus_crimes.json";
import { Grid, Typography } from "@material-ui/core";
import CrimeBarChart from "./CrimeBarChart";
import "./FocusCrimes.css";
export default function FocusCrimes() {

    return (
        <Grid container justify="center" alignItems="stretch" align="center">
            <Grid item xs={12} md={12} className="focus_crimes_heading">
                <Typography variant="h4">Most Effected Categories</Typography>
            </Grid>
            {focus_crimes.map(crime =>
                <Grid key={crime.category} item xs={12} md={3} className="focus_crime_bar_chart">
                    <Typography variant="body1">{crime.category}</Typography>
                    <CrimeBarChart data={crime.data}></CrimeBarChart>
                </Grid>
            )}
        </Grid>
    )
}
