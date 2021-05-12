import React from "react";
import focus_crimes from "../../data/crimeData/focus_crimes.json";
import { Grid, Typography } from "@material-ui/core";
import CrimeBarChart from "./CrimeBarChart";
import "./FocusCrimes.css";
export default function FocusCrimes() {

    return (
        <Grid container justify="center" alignItems="stretch" align="center">
            <Grid item xs={12} md={12} className="focus_crimes_heading">
                <Typography variant="h4">Most Effected Crime Categories</Typography>
                <Typography variant="body1">Below are the arrest categories that were most effected by the spread of covid-19.
                 The bar charts compare monthly aggregated crime counts for year 2019 and 2020 for each category.</Typography>
            </Grid>
            {focus_crimes.map(crime =>
                <Grid key={crime.category} item xs={12} md={3} className="focus_crime_bar_chart">
                    <Typography variant="subtitle2">{crime.category}</Typography>
                    <CrimeBarChart data={crime.data}></CrimeBarChart>
                </Grid>
            )}
        </Grid>
    )
}
