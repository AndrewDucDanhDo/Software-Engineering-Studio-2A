import React from "react";
import {Box, Button, Grid, Paper} from "@material-ui/core";
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
    } from '@devexpress/dx-react-chart-material-ui';
import { Animation, ValueScale } from '@devexpress/dx-react-chart';

const dataStates = [
    [
        { state: '|00\u3009', probability: 0 },
        { state: '|01\u3009', probability: 0 },
        { state: '|10\u3009', probability: 0 },
        { state: '|11\u3009', probability: 0 },
    ],

    [
        { state: '|000\u3009', probability: 0 },
        { state: '|001\u3009', probability: 0 },
        { state: '|010\u3009', probability: 0 },
        { state: '|011\u3009', probability: 0 },
        { state: '|100\u3009', probability: 0 },
        { state: '|101\u3009', probability: 0 },
        { state: '|110\u3009', probability: 0 },
        { state: '|111\u3009', probability: 0 },
    ],

    [
        { state: '|0000\u3009', probability: 0 },
        { state: '|0001\u3009', probability: 0 },
        { state: '|0010\u3009', probability: 0 },
        { state: '|0011\u3009', probability: 0 },
        { state: '|0100\u3009', probability: 0 },
        { state: '|0101\u3009', probability: 0 },
        { state: '|0110\u3009', probability: 0 },
        { state: '|0111\u3009', probability: 0 },
        { state: '|1000\u3009', probability: 0 },
        { state: '|1001\u3009', probability: 0 },
        { state: '|1010\u3009', probability: 0 },
        { state: '|1011\u3009', probability: 0 },
        { state: '|1100\u3009', probability: 0 },
        { state: '|1101\u3009', probability: 0 },
        { state: '|1110\u3009', probability: 0 },
        { state: '|1111\u3009', probability: 0 },
    ],
 ]

export default class QuantumBarChart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { data: [{}] };  // Need to update this to store all possible states for the number of qubits
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }


    calculateNoOfProbs() {
        var tempArray = [];
        var tempArray2 = [];
        if (document.getElementById('amplitudes').rows[0] != null) {
            var length = document.getElementById('amplitudes').rows[0].cells[1].innerText.length - 2;
            tempArray = dataStates[length-2];
            for (var f in tempArray) {
                console.log(tempArray[f].state);
                tempArray2.push({
                    state: tempArray[f].state,
                    probability: tempArray[f].probability
                });
            }
        }
        return tempArray2;
    }

    handleKeyPress = (event) => { // Now have to listen for when #evaluate is called
        var temp = [];
        setTimeout(function () {
            temp = this.calculateNoOfProbs().slice();
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
        }.bind(this), 100)
    }

    render() {
        const { data: chartData } = this.state;
        console.log(chartData);

        return (
            <Grid style={{ backgroundColor: "#F1F1EE" }}>
                <Chart data={chartData} >
                    <ValueScale name="probability" />
                    <ValueAxis scaleName="probability" showGrid={false} showTicks={true} showLine={true} />
                    <ArgumentAxis />
                    <BarSeries
                        valueField="probability"
                        argumentField="state"
                        scaleName="probability"
                    />
                    <Animation />
                </Chart>
            </Grid>
        );
    }
}

