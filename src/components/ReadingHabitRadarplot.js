import React from "react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    PolarAngleAxis,
    Legend,
    Tooltip
} from "recharts";
import { Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


function ReadingHabitRadarplot(data, name, color = '#FF8042') {

    return (
        <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
            <React.Fragment>
                <CardContent >
                    <Typography color={'white'}>{name}</Typography>
                    <ResponsiveContainer width={500} height={300}>
                        <RadarChart outerRadius={90} width={730} height={250} data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis angle={0} />
                            <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.6} />
                            {/* <Legend /> */}
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </CardContent>
            </React.Fragment>
        </Card>
    )
}

export default ReadingHabitRadarplot;