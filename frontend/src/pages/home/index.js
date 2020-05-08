import React from "react";
import {Box, Button, Grid, Paper} from "@material-ui/core";
import QuantumSimulator from "../../components/quantum";
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
} from '@devexpress/dx-react-chart-material-ui';

const data = [
    { year: '1950', population: 2.525 },
    { year: '1960', population: 3.018 },
    { year: '1970', population: 3.682 },
    { year: '1980', population: 4.440 }, 
    { year: '1990', population: 5.310 },
    { year: '2000', population: 6.127 },
    { year: '2010', population: 6.930 },
];

export default class Demo extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data,
        };
    }

    render() {
        const { data: chartData } = this.state;

        return (
            <Grid container style={{ position: "absolute", width: "100%", height: "90%" }}>
                <Grid xs={2} item component={Paper} style={{ backgroundColor: "#f7f7f7" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2>Advertise here!</h2>
                        <a href="https://www.youtube.com/watch?v=oT3mCybbhf0" target="_blank">Click me for more info</a>
                    </div>
                </Grid>
                <Grid xs={10} item container direction="column">
                    <QuantumSimulator />
                    <Chart
                        data={data}
                    >
                        <ValueAxis />
                        <ArgumentAxis />
                        <BarSeries
                            valueField="population"
                            argumentField="year"
                        />
                    </Chart>
                </Grid>
            </Grid>
        );
    }
}


