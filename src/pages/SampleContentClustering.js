import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Grid, Box } from "@mui/material";

import ReadingHabitRadarplot from '../components/ReadingHabitRadarplot';


const COLORS = ['#90ee90', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#da70d6', '#808000'];


function SampleContentClustering() {
    const [reading_habit_sample1, setReading_habit_sample1] = useState([Object]);
    const [reading_habit_sample2, setReading_habit_sample2] = useState([Object]);
    const [reading_habit_sample3, setReading_habit_sample3] = useState([Object]);
    const [reading_habit_sample4, setReading_habit_sample4] = useState([Object]);

    const featchData = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/reading_habit");
        var { data } = await res0;
        setReading_habit_sample1(data.reading_habit_sample1);
        setReading_habit_sample2(data.reading_habit_sample2);
        setReading_habit_sample3(data.reading_habit_sample3);
        setReading_habit_sample4(data.reading_habit_sample4);
    }

    useEffect(() => {
        featchData();
    }, []);

    // console.log(reading_habit_sample1)


    return (
        <Box sx={{ bgcolor: '#EAF2F8'}}>
            <Grid container spacing={0.1} sx={{ mt: 2, mb: 2, width: '80vw' }}
                alignItems="center"
                justify="center">

                <Grid item xs={1} align="left" />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(reading_habit_sample1, 'sample1')}
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(reading_habit_sample2, 'sample2')}
                </Grid>
                <Grid item xs={1} />

                <Grid item xs={1} align="left" />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(reading_habit_sample3, 'sample3')}
                </Grid>
                <Grid item xs={0.5} />
                <Grid item xs={4.75} >
                    {ReadingHabitRadarplot(reading_habit_sample4, 'sample4')}
                </Grid>
                <Grid item xs={1} />

            </Grid>
        </Box>
    )
}

export default SampleContentClustering;