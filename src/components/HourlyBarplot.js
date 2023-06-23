import React from "react";
import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";
import { Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


function HourlyBarplot(data, name, color = '#0088FE') {

    return (
        <div key={name}>
            <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
                <React.Fragment>
                    <CardContent >
                        <Typography color={'white'}>{name}</Typography>
                        <ResponsiveContainer width={500} height={300}>
                            <BarChart width={730} height={250} data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill={color} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </React.Fragment>
            </Card>
        </div>
    )
}

export default HourlyBarplot;