import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function CrimeBarChart({ data }) {


    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={200}
                height={200}
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="MONTH" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="COUNT_2019" fill="#8884d8" />
                <Bar dataKey="COUNT_2020" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );

}
