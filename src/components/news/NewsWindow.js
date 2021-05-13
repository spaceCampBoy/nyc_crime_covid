import React from 'react';
import { Grid, Paper, Typography } from "@material-ui/core";
import news from '../../data/news/news-data.json';
import News from "./News";
import moment from 'moment';
export default function NewsWindow({ newsDate }) {

    const showCovidNews = (data) => {
        const dateNews = data[newsDate];
        if (dateNews)
        {
            const covidNews = dateNews.covid;
            if(covidNews)
            {
                return <><Grid item>
                    <Typography variant="h6">Covid-19</Typography>
                </Grid>
                    <News data={covidNews}></News></>;
            }
        }
    }

    const showCrimeNews = (data) => {
        const dateNews = data[newsDate];
        if (dateNews) {
            const crimeNews = dateNews.crime;
            if (crimeNews) {
                return <><Grid item>
                    <Typography variant="h6">Crime</Typography>
                </Grid>
                    <News data={crimeNews}></News></>;
            }
        }
    }

    const showNewsDate = (date) => {
        const dateString = moment(date).format("Do [of] MMMM, YYYY");
        return <>
            <Grid item>
                <Typography variant="body1">{dateString}</Typography>
            </Grid></>
    }

    return (
        <Paper>
            <Grid container justify="center" alignItems="center" align="center" direction="column">
                <Grid item>
                    <Typography variant="h5">New York Times</Typography>
                </Grid>
                {showNewsDate(newsDate)}
                {showCovidNews(news)}
                {showCrimeNews(news)}
            </Grid>
        </Paper>
    )
}
