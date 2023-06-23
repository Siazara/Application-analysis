import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    Legend,
    Tooltip,
    Pie,
    PieChart,
    Cell,
} from "recharts";
import Axios from "axios";
import { Grid, Box } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ReadingHabitRadarplot from '../components/ReadingHabitRadarplot';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import InfoTooltip from '@mui/material/Tooltip';


const BOOKCOLORS = {
    1: ['#CB4335', '#E74C3C', '#EC7063', '#F1948A', '#F5B7B1', '#FADBD8'],
    4: ['#884EA0', '#9B59B6', '#AF7AC5', '#C39BD3', '#D7BDE2', '#EBDEF0'],
    5: ['#2E86C1', '#3498DB', '#5DADE2', '#85C1E9', '#AED6F1', '#D6EAF8'],
    7: ['#28B463', '#2ECC71', '#58D68D', '#82E0AA', '#ABEBC6', '#D5F5E3']
}

function MostReadItems() {
    const [bookPartCount, setBookPartCount] = useState([Object]);
    const [bookCount, setBookCount] = useState([Object]);
    const [hourlyBook1, setHourlyBook1] = useState([Object]);
    const [hourlyBook4, setHourlyBook4] = useState([Object]);
    const [hourlyBook5, setHourlyBook5] = useState([Object]);
    const [hourlyBook7, setHourlyBook7] = useState([Object]);

    const featchData = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/open_reader_item");
        var { data } = await res0;
        setBookPartCount(data.bookPartCount);
        setBookCount(data.bookCount);
        setHourlyBook1(data.hourlyBook1);
        setHourlyBook4(data.hourlyBook4);
        setHourlyBook5(data.hourlyBook5);
        setHourlyBook7(data.hourlyBook7);
    }

    useEffect(() => {
        featchData();
    }, []);

    // console.log(bookPartCount)


    return (
        <Box sx={{ bgcolor: '#EAF2F8'}}>
            <Grid container spacing={0.1} sx={{ mt: 2, mb: 2, width: '80vw' }}
                alignItems="center"
                justify="center">
                <Grid item xs={1} align="left" />
                <Grid item xs={10} >
                    <Card variant="outlined" style={{ backgroundColor: "#2b2b4b" }}>
                        <React.Fragment>
                            <CardContent >
                                <ResponsiveContainer width={1200} height={450}>
                                    <PieChart  >
                                        <Tooltip />
                                        <Legend verticalAlign="top" />
                                        <Pie data={bookPartCount} dataKey="value" nameKey="name" label outerRadius={145} innerRadius={0} >
                                            {
                                                bookPartCount.map((entry, index) => <Cell key={`cell-${index}`}
                                                    fill={entry.book ? BOOKCOLORS[entry.book][entry.color_index + 1] : 'black'} />)
                                            }
                                        </Pie>
                                        {/* <Pie data={bookCount} dataKey="value" nameKey="name" label outerRadius={165} innerRadius={145} >
                                            {
                                                bookCount.map((entry, index) => <Cell key={`cell-${index}`} fill={OUTERCOLORS[index]} />)
                                            }
                                        </Pie> */}
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </React.Fragment>
                        <InfoTooltip title={<h3 style={{ color: "white" }}>
                            Top ten reading items and their corresponding books are depicted. 
                            Users are restricted to one reading item per hour which is the item read 
                            earlier in the interval. Numbers are the total times an item was read by all users.</h3>}>
                            <IconButton>
                                <InfoIcon style={{ color: 'white', fontSize: 35 }} />
                            </IconButton>
                        </InfoTooltip>
                    </Card>
                </Grid>
                <Grid item xs={1} />

                <Grid item xs={1} align="left" />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(hourlyBook4, 'book 4', BOOKCOLORS[4][0])}
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(hourlyBook5, 'book 5', BOOKCOLORS[5][0])}
                </Grid>
                <Grid item xs={1} />

                <Grid item xs={1} align="left" />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(hourlyBook7, 'book 7', BOOKCOLORS[7][0])}
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(hourlyBook1, 'book 1', BOOKCOLORS[1][0])}
                </Grid>
                <Grid item xs={1} />

            </Grid>
        </Box>
    )
}

export default MostReadItems;