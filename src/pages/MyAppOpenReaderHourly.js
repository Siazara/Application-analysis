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
    Cell
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


function myAppOpenReaderHourly() {
    const [myAppOpenReaderHourlyDistribution, setmyAppOpenReaderHourlyDistribution] = useState([Object]);
    const [myAppOpenReaderHourlyList, setmyAppOpenReaderHourlyList] = useState([Object]);

    const featchData = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/myApp_open_reader_activity");
        var { data } = await res0;
        setmyAppOpenReaderHourlyDistribution(data.myApp_open_reader_hourly_distribution);
        setmyAppOpenReaderHourlyList(data.myApp_open_reader_hourly_list);
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
                                <Typography color={'white'}>myAppOpenReaderHourlyDistribution</Typography>
                                <ResponsiveContainer width={500} height={300}>
                                    <BarChart width={730} height={250} data={myAppOpenReaderHourlyDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#0088FE" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
                        <React.Fragment>
                            <CardContent >
                                <Typography align="left" sx={{ fontSize: 14 }} color="white" gutterBottom>
                                    Users to notify and their corresponding hour
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 7 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Index </TableCell>
                                                <TableCell >User_pseudo_id</TableCell>
                                                <TableCell >Hour</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {myAppOpenReaderHourlyList.map((row) => (
                                                <TableRow key={row.index}>
                                                    <TableCell component="th" scope="row">{row.index}</TableCell>
                                                    <TableCell>{row.user}</TableCell>
                                                    <TableCell>{row.hour}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Grid>
                <Grid item xs={1} />
            </Grid>
        </Box>
    )
}

export default myAppOpenReaderHourly;