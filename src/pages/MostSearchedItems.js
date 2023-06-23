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
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import HourlyBarplot from '../components/HourlyBarplot';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import InfoTooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

const BOOKCOLORS = {
    2: ['#78281F', '#943126', '#B03A2E', '#CB4335', '#E74C3C', '#EC7063', '#F1948A', '#F5B7B1', '#FADBD8', '#FDEDEC '],
    7: ['#186A3B', '#1D8348', '#239B56 ', '#28B463', '#2ECC71', '#58D68D', '#82E0AA', '#ABEBC6', '#D5F5E3', '#EAFAF1']
}

function MostSearchedItems() {
    const [searchPartBookCount, setSearchPartBookCount] = useState([Object]);

    const fetchData = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/most_searched_item");
        var { data } = await res0;
        setSearchPartBookCount(data.searchPartBookCount);
    }

    useEffect(() => {
        fetchData();
    }, []);


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
                                        <Pie data={searchPartBookCount} dataKey="value" nameKey="name" label outerRadius={145} innerRadius={0} >
                                            {
                                                searchPartBookCount.map((entry, index) => <Cell key={`cell-${index}`}
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
                            Top ten searched items and their corresponding books are depicted.</h3>}>
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

export default MostSearchedItems;