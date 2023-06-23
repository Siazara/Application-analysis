import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    LabelList,
    Pie,
    PieChart,
    Area,
    AreaChart,
    Cell,
    RadarChart,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    PolarAngleAxis,
} from "recharts";
import Axios from "axios";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import InfoTooltip from '@mui/material/Tooltip';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];


function ClusteringVisits() {
    const [appVisits, setAppVisits] = useState([Object]);
    const [portions, setPortions] = useState([Object]);
    const [hourlyDistribution, setHourlyDistribution] = useState([Object]);
    // const [labels, setLabels] = useState([{cluster: 'c1'}]);

    const featchData = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/daily_activity");
        var { data } = await res0;
        setAppVisits(data.visits);
        setPortions(data.portions);
        setHourlyDistribution(data.hourly_distribution);
    }

    useEffect(() => {
        featchData();
    }, []);


    // if (appVisits.length > 0) {
    // // setLabels(Object.keys(appVisits[0]).filter(item => item !== 'datetime'))
    // console.log(appVisits)
    // console.log(labels.length)
    // }

    // labels.reduce(function(map, cluster) {
    //     map['cluster'] = '1';
    //     return map;
    // })
    // console.log(labels)
    // console.log(appVisits.keys())
    const labels = [
        {
            key: "frequenters",
            color: "green"
        },
        {
            key: "moderate",
            color: "yellow"
        },
        {
            key: "meh",
            color: "red"
        },
        {
            key: "apathetic",
            color: "cyan"
        },
    ];

    const [barProps, setBarProps] = useState(
        labels.reduce(
            (a, { key }) => {
                a[key] = false;
                return a;
            }
        )
    );

    const selectBar = (e) => {
        setBarProps({
            ...barProps,
            [e.dataKey]: !barProps[e.dataKey],
        });
    };

    // console.log(barProps)

    return (
        <Box sx={{ bgcolor: '#EAF2F8'}}>
            <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                alignItems="center"
                justify="center">
                <Grid item xs={1} align="left" />
                <Grid item xs={10} align="left">
                    <Card variant="outlined" style={{ background: 'linear-gradient(to left, #2b2b4b, #2b2b4b)'}}>
                    <Typography color={'white'}>Clustering per visit frequency</Typography>
                        <React.Fragment>
                            <CardContent >
                                <AreaChart alignment="left" width={1100} height={350} data={appVisits}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="datetime" color="white" tick={{ fill: 'white', fontSize: 12 }} tickLine={{ stroke: 'red' }} />
                                    <YAxis color="white" width={50} tick={{ fill: 'white', fontSize: 15 }} tickLine={{ stroke: 'red' }} />
                                    <Tooltip />
                                    <Legend
                                        onClick={selectBar}
                                    />
                                    {labels.map((label, index) => (
                                        <Area type="monotone" dataKey={label.key} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.5}
                                            hide={barProps[label.key] === true} />
                                    ))}
                                </AreaChart>
                            </CardContent>
                        </React.Fragment>
                        <InfoTooltip title={<h3 style={{ color: "white" }}>
                            Users are restricted to one
                            visit per day; also users with installation lifetime of less than 2 weeks
                            are not considered. Users are clustered based on the ratio of their daily visits
                            to their lifetime with frequenters above 0.5, moderates between 0.5 and 0.2,
                            mehs between 0.2 and 0.1 and apathetics less than 0.1.
                            Only exclusive myApp events are included.</h3>}>
                            <IconButton>
                                <InfoIcon style={{ color: 'white', fontSize: 35 }} />
                            </IconButton>
                        </InfoTooltip>
                    </Card>
                </Grid>
                <Grid item xs={1} align="left" />
                <Grid item xs={1} align="left" />
                <Grid item xs={4.75} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
                        <Typography color={'white'}>Users per cluster</Typography>
                        <React.Fragment>
                            <CardContent >
                                <ResponsiveContainer width={500} height={300}>
                                    <PieChart  >
                                        <Tooltip />
                                        <Legend verticalAlign="top" height={70} />
                                        <Pie data={portions} dataKey="value" nameKey="name" label outerRadius={85} innerRadius={65} cy={100} >
                                            {
                                                portions.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                            }
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b"}}>
                    <Typography color={'white'}>Distribution of events per hour</Typography>
                        <React.Fragment>
                            <CardContent >
                                <ResponsiveContainer width={500} height={300}>

                                    {/* <BarChart width={730} height={250} data={hourlyDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#0088FE" />
                                    </BarChart> */}
                                    <RadarChart outerRadius={90} width={730} height={250} data={hourlyDistribution}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="hour" />
                            <PolarRadiusAxis angle={0} />
                            <Radar dataKey="value" stroke='#FF8042' fill='#FF8042' fillOpacity={0.6} />
                            {/* <Legend /> */}
                            <Tooltip />
                        </RadarChart>

                                </ResponsiveContainer>
                            </CardContent>
                        </React.Fragment>
                        <InfoTooltip title={<h3 style={{ color: "white" }}>
                            Events limited to exclusive myApp events. Users are restricted to one
                            activity per hour. Distribution is normalized.</h3>}>
                            <IconButton>
                                <InfoIcon style={{ color: 'white', fontSize: 35 }} />
                            </IconButton>
                        </InfoTooltip>
                    </Card>
                </Grid>
                <Grid item xs={1} />
            </Grid>
        </Box>
    )
}

export default ClusteringVisits;