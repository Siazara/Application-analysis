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
    LineChart,
    Line
} from "recharts";
import Axios from "axios";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];


function SampleHourlyPlotPerDay() {
    const [userOpenReader1, setUserOpenReader1] = useState([Object]);
    const [userOpenReader2, setUserOpenReader2] = useState([Object]);
    const [userOpenReader3, setUserOpenReader3] = useState([Object]);
    const [userOpenReader4, setUserOpenReader4] = useState([Object]);

    const featchData = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/user_open_reader_activity");
        var { data } = await res0;
        setUserOpenReader1(data.userOpenReader1);
        setUserOpenReader2(data.userOpenReader2);
        setUserOpenReader3(data.userOpenReader3);
        setUserOpenReader4(data.userOpenReader4);
    }

    useEffect(() => {
        featchData();
    }, []);

    // console.log(myAppOpenReaderHourlyList)


    return (
        <Box sx={{ bgcolor: '#EAF2F8'}}>
            <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                alignItems="center"
                justify="center">
                <Grid item xs={1} align="left" />
                <Grid item xs={4.75} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
                        <React.Fragment>
                            <CardContent >
                                <LineChart width={530} height={350} data={userOpenReader1}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="hour" stroke="#8884d8" />
                                </LineChart>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
                        <React.Fragment>
                            <CardContent >
                            <LineChart width={530} height={350} data={userOpenReader2}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="hour" stroke="#8884d8" />
                                </LineChart>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={1} />

                <Grid item xs={1} align="left" />
                <Grid item xs={4.75} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
                        <React.Fragment>
                            <CardContent >
                                <LineChart width={530} height={350} data={userOpenReader3}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="hour" stroke="#8884d8" />
                                </LineChart>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
                        <React.Fragment>
                            <CardContent >
                            <LineChart width={530} height={350} data={userOpenReader4}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="hour" stroke="#8884d8" />
                                </LineChart>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={1} />

            </Grid>
        </Box>
    )
}

export default SampleHourlyPlotPerDay;