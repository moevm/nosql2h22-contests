import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";

class StatisticField {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

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
        </Box>
    )
}
