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
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';


class StatisticField {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

const data = [
    {
        name: 'Москва',
        value: 2,
    },
    {
        name: 'Таганрог',
        value: 1,
    },
];

const statistics = [
    new StatisticField("Популярнейший город", "Москва"),
    new StatisticField("Редчайший город", "Таганрог")
]

export default function Statistic(props) {
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
                        {statistics.map(statistic => (
                            <TableRow key={statistic.name}
                                      sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    {statistic.name}
                                </TableCell>
                                <TableCell align="right">{statistic.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <p/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Y</InputLabel>
                <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={"Количество конкурсов"}
                        label="Y"
                        onChange={() => console.log("kek")}>
                    <MenuItem value={"Количество конкурсов"}>Количество конкурсов</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                </Select>
            </FormControl>
            <p/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">X</InputLabel>
                <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={"Место проведения"}
                        label="X"
                        onChange={() => console.log("kek")}>
                    <MenuItem value={"Место проведения"}>Место проведения</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                </Select>
            </FormControl>
            <p/>
            <BarChart width={1000} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="value" fill="#8884d8"/>
            </BarChart>
        </Box>
    )
}
