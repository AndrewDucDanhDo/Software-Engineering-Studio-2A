import React, { useContext, useEffect, useRef, useState, Component } from "react";
//import React from "react";
import {Box, Button, Grid, Paper} from "@material-ui/core";
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
    } from '@devexpress/dx-react-chart-material-ui';
import { Animation, ValueScale } from '@devexpress/dx-react-chart';
import { CircuitResultsContext } from "../../context/circuit";

const dataStates = 
    [
        { amplitude: 0.0, state: '|00\u3009', probability: 0.5 },
        { amplitude: 0.0, state: '|01\u3009', probability: 0 },
        { amplitude: 0.0, state: '|10\u3009', probability: 0.5 },
        { amplitude: 0.0, state: '|11\u3009', probability: 0 },
    ];


/*export default class QuantumBarChart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { data: [{}] };  // Need to update this to store all possible states for the number of qubits
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }*/


    /*calculateNoOfProbs() {
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
    }*/

    /*handleKeyPress = (event) => { // Now have to listen for when #evaluate is called*/
        /*var temp = [];
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
        }.bind(this), 100)*/

        /*var temp;
        temp = this.circuitResults.slice(0);
        this.setState({ data: temp });*/

    //}
/*
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
}*/

export default function QuantumBarChart(props) {
    const circuitResults = useContext(CircuitResultsContext);
    console.log(circuitResults);
    const [data, setData] = useState([{}]);

  
    //const enterPress = useKeyPress('Enter', circuitResults);

    /*function useKeyPress(targetKey) {
        // State for keeping track of whether key is pressed
        const [keyPressed, setKeyPressed] = useState(false);

        // If pressed key is our target key then set to true
        function downHandler({ key }) {
            if (key === targetKey) {
                setKeyPressed(true);
                add();
            }
        }

        // If released key is our target key then set to false
        const upHandler = ({ key }) => {
            if (key === targetKey) {
                setKeyPressed(false);
            }
        };

        // Add event listeners
        useEffect(() => {
            window.addEventListener('keydown', downHandler); //just build a button
            window.addEventListener('keyup', upHandler);
            // Remove event listeners on cleanup
            return () => {
                window.removeEventListener('keydown', downHandler);
                window.removeEventListener('keyup', upHandler);
            };
        }, [targetKey]); // Empty array ensures that effect is only run on mount and unmount

        return keyPressed;
    }
    */

    window.onload = function () {
        var evBtn = document.getElementById("evaluateButton");
        evBtn.onClick = add();
        setData(dataStates);
        //document.getElementById("evaluateButton").addEventListener("click",add);
    }

    function event_handler(event, arg) {
        console.log(event, arg);
    }


    function add() { // handler
        console.log(circuitResults);
        var temp;
        temp = [...circuitResults];
        console.log(temp);
        setData(circuitResults);
    }

    return (
        <Grid style={{ backgroundColor: "#F1F1EE" }}>
            <Chart data={ data } >
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
            <button onClick={add}>
                press me to test me
            </button>
        </Grid>
    );

} 

