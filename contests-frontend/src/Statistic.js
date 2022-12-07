import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import React from 'react';
import axios from "axios";
import {Bar, BarChart, Legend, Tooltip, XAxis, YAxis} from "recharts";

export default function Statistic() {
    const [firstRequest, setFirstRequest] = React.useState(true);

    const [graphData, setGraphData] = React.useState([]);
    const [statistics, setStatistics] = React.useState({
        "Популярнейший город": "",
        "Редчайший город": "",
        // ...
    });

    function getPopularCities() {
        axios.get(`http://localhost:3000/contests/mostPopularCities`, {
            params: {
                count: 5
            }
        }).then(res => setGraphData(res.data));
    }

    const graphStatistics = {
        "Не выбрано": () => setGraphData([]),
        "Популярные города": getPopularCities,
        // ...
    };

    getStatistics();

    function getStatistics() {
        if (firstRequest) {
            setFirstRequest(false);
            axios.get(`http://localhost:3000/contests/mostPopularCities`, {
                params: {
                    count: 1
                }
            }).then(res => updateStatisticField("Популярнейший город", res.data.name));

            axios.get(`http://localhost:3000/contests/leastPopularCities`, {
                params: {
                    count: 1
                }
            }).then(res => updateStatisticField("Редчайший город", res.data.name));
        }
    }

    function updateStatisticField(key, value) {
        const updatedStatistic = {...statistics}
        updatedStatistic[key] = value;
        setStatistics(updatedStatistic);
    }

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Статистика</TableCell>
                            <TableCell align="right"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(statistics).map(entry => (
                            <TableRow key={entry[0]}
                                      sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    {entry[0]}
                                </TableCell>
                                <TableCell align="right">{entry[1]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <p/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Тип</InputLabel>
                <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Тип"
                        value="Не выбрано"
                        onChange={action => graphStatistics[action.target.value]()}>
                    {Object.entries(graphStatistics).map(entry => (
                        <MenuItem key={entry[0]} value={entry[0]}>{entry[0]}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <p/>
            <BarChart width={1000} height={250} data={graphData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="value" fill="#8884d8"/>
            </BarChart>
        </Box>
    )
}
