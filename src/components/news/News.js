import React from 'react'
import { Grid, Paper, Typography, IconButton } from "@material-ui/core";
import './News.css';

export default function News({data}) {
    const provider = "https://www.nytimes.com/";
    

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const getImage = () => {
        if(data.thumbnail_url)
        {
            return <img className="news_thumbnail" src={provider + data.thumbnail_url} alt="Logo" />
        }
    }

    return (
        <Paper className="news" onClick={() => openInNewTab(data.web_url)}>
            <Grid container justify="flex-start" alignItems="flex-start" align="left" direction="row" spacing={1}>
                <Grid item>
                    {getImage()}
                    <Typography className="pub_date">Publish on: {data.pub_date}</Typography>
                    <Typography className="news_heading">{data.headline}</Typography>
                    {data.snippet}
                </Grid>
            </Grid>
        </Paper>
    )
}
