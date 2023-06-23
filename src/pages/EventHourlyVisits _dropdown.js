import React, { useEffect, useState } from "react";
import Axios from "axios";
import GridHourlyBarplot from '../components/GridHourlyBarplot';
import HourlyBarplot from '../components/HourlyBarplot';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Grid } from "@mui/material";
import Button from '@mui/material/Button';

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


function EventHourlyVisits() {
    const [eventNames, setEventNames] = useState([]);

    const [{ items }, setItems] = useState({ items: [] });
    const [{ eventList }, setEventList] = useState({ eventList: [] });

    // const customFetch = async (event_name) => {

    //     const res0 = await Axios.get("http://192.168.33.87:5002/hourly_one_event_activity?event_name=" + event_name);
    //     var { data } = await res0;
    //     setmyAppSetting(data);
    // }

    const addItem = async (event_name) => {
        const res0 = await Axios.get("http://192.168.33.87:5002/hourly_one_event_activity?event_name=" + event_name);
        var { data0 } = await res0;
        eventList.push(HourlyBarplot(data0, event_name))
        // eventList.push(
        //     <div key={event_name}>
        //     <Card variant="outlined" style={{ backgroundColor: "#2b2b4b", height: '40vh' }}>
        //     <React.Fragment>
        //         <CardContent >
        //             <Typography color={'white'}>{event_name}</Typography>
        //             <ResponsiveContainer width={500} height={300}>
        //                 <BarChart width={730} height={250} data={data0}>
        //                     <CartesianGrid strokeDasharray="3 3" />
        //                     <XAxis dataKey="hour" />
        //                     <YAxis />
        //                     <Tooltip />
        //                     <Bar dataKey="value" fill='#0088FE' />
        //                 </BarChart>
        //             </ResponsiveContainer>
        //         </CardContent>
        //     </React.Fragment>
        // </Card>
        // </div>
        // )
        console.log(eventList)

        // if ((data.length % 2) == 0) {
      
        // data.push('salam')
        // }
        // else {
        
        // data.push('chetori')
      
        // }
        setEventList({ eventList: [...eventList] });
        
        if ((eventList.length % 2) != 0) {
             items.push(
             <div key={event_name}>
                <Grid container spacing={2}>
                <Grid item xs={1} />
                <Grid item xs={4}>
                  {eventList.slice(-1)[0]}
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={1} />
              </Grid>
             </div>
           );
        }
        else {
        items.pop()
             items.push(
             <div key={event_name}>
                <Grid container spacing={2}>
                <Grid item xs={1} />
                <Grid item xs={4}>
                  {eventList.slice(-2)[0]}
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={4}>
                  {eventList.slice(-1)[0]}
                </Grid>
                <Grid item xs={1} />
              </Grid>
             </div>
           );
      
        }     
           setItems({ items: [...items] });
           
         };

    // const initialValue = [
    //     { id: 0, value: " --- Select a State ---" }];
    // const initialState = { name: "Bob", occupation: "builder" };
    // const [state, updateState] = React.useReducer(
    //     (state, updates) => ({ ...state, ...updates }),
    //     initialState
    // );


    const featchEvents = async () => {

        const res0 = await Axios.get("http://192.168.33.87:5002/get_event_names");
        var { data } = await res0;
        // console.log(data)
        setEventNames(data);

        data.map((name, index) => {
            if (eventNames.lenght == 0) {
                eventNames.push({
                    name: name
                });
            }
        })
    }




    // const allowedState = [
    //     { id: 1, value: "Alabama" },
    //     { id: 2, value: "Georgia" },
    //     { id: 3, value: "Tennessee" }
    //   ];

    // const [stateOptions, setStateValues] = useState(initialValue);

    const [myAppSetting, setmyAppSetting] = useState(null);
    const [myAppQuickAccessClick, setmyAppQuickAccessClick] = useState(null);
    const [myAppCalendarEvent, setmyAppCalendarEvent] = useState(null);
    const [myAppBottomNavItemClick, setmyAppBottomNavItemClick] = useState(null);
    const [myAppDialogEvent, setmyAppDialogEvent] = useState(null);
    const [myAppOpenReader, setmyAppOpenReader] = useState(null);
    const [myAppDailyAmalShortcut, setmyAppDailyAmalShortcut] = useState(null);
    const [myAppSearchEvent, setmyAppSearchEvent] = useState(null);
    const [sessionStart, setSessionStart] = useState(null);

    // const featchData = async () => {

    //     const res0 = await Axios.get("http://192.168.33.87:5002/hourly_event_activity");
    //     var { data } = await res0;
    //     setmyAppSetting(data.myApp_setting);
    //     setmyAppQuickAccessClick(data.myApp_quick_access_click);
    //     setmyAppCalendarEvent(data.myApp_calendar_event);
    //     setmyAppBottomNavItemClick(data.myApp_bottom_nav_item_click);
    //     setmyAppDialogEvent(data.myApp_dialog_event);
    //     setmyAppOpenReader(data.myApp_open_reader);
    //     setmyAppDailyAmalShortcut(data.myApp_daily_amal_shortcut);
    //     setmyAppSearchEvent(data.myApp_search_event);
    //     setSessionStart(data.session_start);
    // }

    const featchEvent = async (event_name, event) => {

        const res0 = await Axios.get("http://192.168.33.87:5002/hourly_one_event_activity?event_name=" + event_name);
        var { data } = await res0;
        switch (event_name) {
            case 'myApp_setting_event':
                if (event.target.checked) {
                    setmyAppSetting(data);
                } else {
                    setmyAppSetting(null);
                }
                break;
            case 'myApp_quick_access_click':
                if (event.target.checked) {
                    setmyAppQuickAccessClick(data);
                } else {
                    setmyAppQuickAccessClick(null);
                }
                break;
            case 'myApp_calendar_event':
                if (event.target.checked) {
                    setmyAppCalendarEvent(data);
                } else {
                    setmyAppCalendarEvent(null);
                }
                break;
            case 'myApp_bottom_nav_item_click':
                if (event.target.checked) {
                    setmyAppBottomNavItemClick(data);
                } else {
                    setmyAppBottomNavItemClick(null);
                }
                break;
            case 'myApp_dialog_event':
                if (event.target.checked) {
                    setmyAppDialogEvent(data);
                } else {
                    setmyAppDialogEvent(null);
                }
                break;
            case 'myApp_open_reader':
                if (event.target.checked) {
                    setmyAppOpenReader(data);
                } else {
                    setmyAppOpenReader(null);
                }
                break;
            case 'myApp_daily_amal_shortcut':
                if (event.target.checked) {
                    setmyAppDailyAmalShortcut(data);
                } else {
                    setmyAppDailyAmalShortcut(null);
                }
                break;
            case 'myApp_search_event':
                if (event.target.checked) {
                    setmyAppSearchEvent(data);
                } else {
                    setmyAppSearchEvent(null);
                }
                break;
            case 'session_start':
                if (event.target.checked) {
                    setSessionStart(data);
                } else {
                    setSessionStart(null);
                }
                break;
        }
    }

    const plotBars = () => {
        return (
            <div id='bars'>
                {GridHourlyBarplot(myAppSetting, 'myApp_setting_event', myAppQuickAccessClick, 'myApp_quick_access_click')}
                {GridHourlyBarplot(myAppCalendarEvent, 'myApp_calendar_event', myAppBottomNavItemClick, 'myApp_bottom_nav_item_click')}
                {GridHourlyBarplot(myAppDialogEvent, 'myApp_dialog_event', myAppOpenReader, 'myApp_open_reader')}
                {GridHourlyBarplot(myAppDailyAmalShortcut, 'myApp_daily_amal_shortcut', myAppSearchEvent, 'myApp_search_event')}
                {GridHourlyBarplot(sessionStart, 'session_start', null, null)}
            </div>
        )
    }

    useEffect(() => {
        plotBars();
        featchEvents();
        // setStateValues(allowedState);
    }, []);

    // console.log(eventNames)


    return (
        <div>
            <FormGroup>
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_setting_event', e)} />} label="myApp_setting_event" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_quick_access_click', e)} />} label="myApp_quick_access_click" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_calendar_event', e)} />} label="myApp_calendar_event" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_bottom_nav_item_click', e)} />} label="myApp_bottom_nav_item_click" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_dialog_event', e)} />} label="myApp_dialog_event" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_open_reader', e)} />} label="myApp_open_reader" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_daily_amal_shortcut', e)} />} label="myApp_daily_amal_shortcut" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('myApp_search_event', e)} />} label="myApp_search_event" />
                <FormControlLabel control={<Checkbox onClick={(e) => featchEvent('session_start', e)} />} label="session_start" />
            </FormGroup>
            {plotBars()}
            <div id='plots'>
                            <Button
                                variant='contained'
                                onClick={() => addItem('myApp_setting_event')}
                            >
                                plot
                            </Button>
                        </div>
      {items}
        </div>
    )
}

export default EventHourlyVisits;