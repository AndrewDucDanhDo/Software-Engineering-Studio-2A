import React from "react";
import {Box, Button, Grid, Paper} from "@material-ui/core";
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
    } from '@devexpress/dx-react-chart-material-ui';
import { Animation, ValueScale } from '@devexpress/dx-react-chart';

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
        /*var tempString = '|';
        var tempArray = [];
        var binary = ["0", "1"];
        if (document.getElementById('amplitudes').rows[0] != null) {
            //var length = document.getElementById('amplitudes').rows[0].cells[1].innerText.length - 2;
            var length = 3
            var numberOfPerm = Math.pow(length, 2);
            for (var t = 0; t < numberOfPerm; t++) {
                for (var y = 0; y < 2; y++) {
                    for (var u = 0; u < length; u++) {
                        tempString = tempString + (binary[y]);
                    }
                }
                tempString = tempString + ('\u3009');
                console.log(tempString);
                tempString = '|';
            }
        }
        //console.log(tempArray);
        return tempArray;*/

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
        }.bind(this), 50)
    }

    render() {
        const { data: chartData } = this.state;

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

