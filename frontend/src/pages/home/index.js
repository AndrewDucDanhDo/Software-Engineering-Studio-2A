import React from "react";
import {Box, Button, Grid, Paper} from "@material-ui/core";
import QuantumSimulator from "../../components/quantum";
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation, ValueScale } from '@devexpress/dx-react-chart';

const data0 = [
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
            data: [                             // Need to update this to become automated 
                /*{ state: '|00\u3009', probability: 0.0 },
                { state: '|01\u3009', probability: 0.0 },
                { state: '|10\u3009', probability: 0.0 },
                { state: '|11\u3009', probability: 0.0 },*/
            ]
        };

    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    calculateNoOfProbs() {
        var tempString;
        var tempArray = [];
        var binary = ["0", "1"];
        if (document.getElementById('amplitudes').rows[0] != null) {
            var length = document.getElementById('amplitudes').rows[0].cells[1].innerText.length - 2;
            var numberOfPerm = Math.pow(length, 2);
            for (var j = 0; j < 2; j++) {
                for (var k = 0; k < 2; k++) {
                    tempString = '|' + binary[j] + binary[k] + '\u3009';
                    tempArray.push({
                        state: tempString,
                        probability: 0
                    });
                }
            }
        }
        console.log(tempArray);
        return tempArray;
    }

    handleKeyPress = (event) => { // Now have to listen for when #evaluate is called
        var temp = [];
        var index;
        setTimeout(function () {
            temp = this.calculateNoOfProbs();
            if (document.getElementById('amplitudes').rows[0] != null && event.key === 'Enter') {
                for (var i = 0; i < document.getElementById('amplitudes').rows.length; i++) {
                    for (var p in temp) {
                        if (temp[p].state == document.getElementById('amplitudes').rows[i].cells[1].innerText) {
                            temp[p].probability = parseFloat(document.getElementById('amplitudes').rows[i].cells[2].innerText, 10) / 100;
                        }
                    }
                }
            }
            this.setState({ data: temp });
        }.bind(this),5)
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
                <Grid xs={10} item container direction="column" justify="space-between" onChange={this.handleTheChange}>
                    <QuantumSimulator />
                    <Grid style={{ backgroundColor: "#F1F1EE" }}>
                    <Chart
                        data={chartData}
                    >
                        <ValueScale name="probability"/>
                        <ValueAxis scaleName="probability" showGrid={false} showTicks={true} showLine={true}/>
                        <ArgumentAxis />
                        <BarSeries
                            valueField="probability"
                            argumentField="state"
                            scaleName="probability"
                        />
                        <Animation />
                        </Chart>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}


