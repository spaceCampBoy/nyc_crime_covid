import React, { useState } from "react";
import { ResponsiveChoropleth, ResponsiveGeoMap } from '@nivo/geo';
import { nyc_borough_geo } from "../../data/nycGeo";
import crime_data from "../../data/crimeData/crime_counts.json";
import selected_colors from "../../data/boroColors_selected.json";
export default function NYCMap({ data, setFilters }) {
    const unselected_color = "#eeeeee";
    const unselected_colors = Object.keys(selected_colors).reduce((acc, key) => { acc[key] =unselected_color; return acc; }, {})
    const [colors, setColors] = useState({...unselected_colors})

    const tooltipFormater = (e) => {
        return <div style={{ "backgroundColor": "white", "padding": "5px" }}><b>{e.feature.properties.BoroName}</b></div>;
    }

    const colorFormater = (args) => {
        return colors[args.properties.BoroName]
    }

    const mouseClick = (e) => {
        const name = e.properties.BoroName;
        const cur = colors[name];
        const selected = selected_colors[name];
        const unselected = unselected_colors[name];
        let next = cur == selected ? unselected : selected;
        setColors({...colors, [name]: next});
        setFilters(name);
    }

    return (
    <ResponsiveGeoMap
        data={crime_data}
        features={nyc_borough_geo.features}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        height={250}
        fillColor={colorFormater}
        unknownColor="#666666"
        label="properties.BoroName"
        valueFormat=".2s"
        projectionType="orthographic"
        projectionScale={25000}
        projectionTranslation={[0.39, 0.5]}
        projectionRotation={[74.05, -40.7, -360]}
        enableGraticule={true}
        graticuleLineColor="#dddddd"
        borderWidth={1}
        borderColor="#152538"
        tooltip={tooltipFormater}
        onClick={mouseClick}
    />
)}