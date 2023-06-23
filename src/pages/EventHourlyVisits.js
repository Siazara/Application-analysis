import React, { useEffect, useState } from "react";
import Axios from "axios";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Grid, Box } from "@mui/material";
import HourlyBarplot from '../components/HourlyBarplot';
import ReadingHabitRadarplot from '../components/ReadingHabitRadarplot';


function EventHourlyVisits() {
    const [{ eventNames }, setEventNames] = useState({ eventNames: [] });

    const fetchEvents = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/get_event_names");
        var { data } = await res0;

        data.map((name, index) => {
            if (typeof eventNames.lenght == 'undefined') {
                eventNames.push(
                    <FormControlLabel control={<Checkbox onClick={(e) => addItem(name, e)} />} label={name} />
                );
            }
        })
        setEventNames({ eventNames: [...eventNames] });
    }

    const [{ items }, setItems] = useState({ items: [] });
    const [{ eventList }, setEventList] = useState({ eventList: [] });
    const [{ eventPlotList }, setEventPlotList] = useState({ eventPlotList: [] });
    const [{ fetchedData }, setFetchedData] = useState({ fetchedData: [] });

    const addItem = async (event_name, e) => {

        const makePlot = async (event_name) => {
            const loadedData = fetchedData.find(object => object.event_name == event_name)
            // eventPlotList.push(HourlyBarplot(loadedData.data, event_name))
            eventPlotList.push(ReadingHabitRadarplot(loadedData.data, event_name))
            console.log(loadedData.data)

            setEventPlotList({ eventPlotList: [...eventPlotList] });

            if ((eventPlotList.length % 2) != 0) {
                items.push(
                    <div key={items.lenght}>
                        <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                            alignItems="center"
                            justify="center">
                            <Grid xs={1} />
                            <Grid item xs={4.75}>
                                {eventPlotList.slice(-1)[0]}
                            </Grid>
                            <Grid xs={0.5} />
                            <Grid item xs={4.75}>
                            </Grid>
                            <Grid xs={1} />
                        </Grid>
                    </div>
                );
            }
            else {
                items.pop()
                items.push(
                    <div key={items.lenght}>
                        <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                            alignItems="center"
                            justify="center">
                            <Grid xs={1} />
                            <Grid item xs={4.75}>
                                {eventPlotList.slice(-2)[0]}
                            </Grid>
                            <Grid xs={0.5} />
                            <Grid item xs={4.75}>
                                {eventPlotList.slice(-1)[0]}
                            </Grid>
                            <Grid xs={1} />
                        </Grid>
                    </div>
                );
            }
            setItems({ items: [...items] });
        }

        if (e.target.checked == true) {

            const res0 = await Axios.get("http://192.168.33.87:5002/hourly_one_event_activity?event_name=" + event_name);
            var { data } = await res0;

            eventList.push(event_name)
            fetchedData.push({ event_name: event_name, data: data })
            setFetchedData({ fetchedData: [...fetchedData] });
            setEventList({ eventList: [...eventList] });
            makePlot(event_name);


        } else if (e.target.checked == false) {
            const index = eventList.findIndex(object => object == event_name)
            if (index > -1) {
                eventList.splice(index, 1)
                items.splice(Math.floor(index / 2))

                if ((index % 2) == 0) {
                    eventPlotList.splice(index)

                    for (var i = index; i < eventList.length; i++) {
                        makePlot(eventList[i])
                    }
                }
                else {
                    eventPlotList.splice(index - 1)

                    for (var i = index - 1; i < eventList.length; i++) {
                        makePlot(eventList[i])
                    }
                }
            }
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);


    return (
        <div>
            <Box sx={{ bgcolor: '#D5D8DC'}}>
                <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                    alignItems="center"
                    justify="center">
                    <Grid xs={1} />
                    <Grid item xs={10}>
                        <FormGroup>
                            {eventNames}
                        </ FormGroup>
                    </Grid>
                    <Grid xs={1} />
                </Grid>
            </Box>
            <Box sx={{ bgcolor: '#EAF2F8'}}>
                {items}
            </Box>
        </div>
    )
}

export default EventHourlyVisits;
