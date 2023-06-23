import React from "react";
import Grid from "@mui/material/Grid";
import HourlyBarplot from './HourlyBarplot';


function GridHourlyBarplot(data1, name1, data2, name2) {

    if (data1 !== null && data2 !== null) {
        return (
            <div>
                <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                    alignItems="center"
                    justify="center">
                    <Grid item xs={1} align="left" />
                    <Grid item xs={4.75} >
                        {HourlyBarplot(data1, name1)}
                    </Grid>
                    <Grid item xs={0.5} />
                    <Grid item xs={4.75} >
                        {HourlyBarplot(data2, name2)}
                    </Grid>
                    <Grid item xs={1} align="left" />
                </Grid>
            </div>
        )
    } else if (data1 !== null) {
        return (
            <div>
                <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                    alignItems="center"
                    justify="center">
                    <Grid item xs={1} align="left" />
                    <Grid item xs={4.75} >
                        {HourlyBarplot(data1, name1)}
                    </Grid>
                    <Grid item xs={0.5} />
                    <Grid item xs={4.75} >

                    </Grid>
                    <Grid item xs={1} align="left" />
                </Grid>
            </div>
        )
    } else if (data2 !== null) {
        return (
            <div>
                <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                    alignItems="center"
                    justify="center">
                    <Grid item xs={1} align="left" />
                    <Grid item xs={4.75} >
                    </Grid>
                    <Grid item xs={0.5} />
                    <Grid item xs={4.75} >
                        {HourlyBarplot(data2, name2)}
                    </Grid>
                    <Grid item xs={1} align="left" />
                </Grid>
            </div>
        )
    } else {
        return (
            <div>
                <Grid container spacing={0.1} sx={{ mt: 2, width: '80vw' }}
                    alignItems="center"
                    justify="center">
                    <Grid item xs={1} align="left" />
                    <Grid item xs={4.75} >
                    </Grid>
                    <Grid item xs={0.5} />
                    <Grid item xs={4.75} >
                    </Grid>
                    <Grid item xs={1} align="left" />
                </Grid>
            </div>
        )
    }
}

export default GridHourlyBarplot;