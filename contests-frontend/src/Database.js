import React from "react";
import {
    Box,
    Button,
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
    TableRow,
    TextField
} from "@mui/material";

import Statistic from "./Statistic";

export function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}

export const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function Database() {
    const [field, setField] = React.useState('');
    const [comparator, setComparator] = React.useState('');
    const [target, setTarget] = React.useState('');

    const handleChangeField = (event) => {
        setField(event.target.value);
    }

    const handleChangeComparator = (event) => {
        setComparator(event.target.value);
    }

    const handleChangeTarget = (event) => {
        setTarget(event.target.value);
    }

    return (
        <div className="Database">
            <Box sx={{width: 800, maxWidth: '80%', margin: "auto"}} className="Upload">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Атрибут</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={field}
                        label="Age"
                        onChange={handleChangeField}
                    >
                        <MenuItem value={10}>Дата начала</MenuItem>
                        <MenuItem value={20}>Кол-во мест</MenuItem>
                        <MenuItem value={30}>Месторасположение</MenuItem>
                    </Select>
                </FormControl>
                <p/>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Сравнение</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={comparator}
                        label="Age"
                        onChange={handleChangeComparator}
                    >
                        <MenuItem value={10}>Больше</MenuItem>
                        <MenuItem value={20}>Меньше</MenuItem>
                        <MenuItem value={30}>Равно</MenuItem>
                    </Select>
                </FormControl>
                <p/>
                <TextField fullWidth id="standard-basic" label="Чем" variant="outlined" onChange={handleChangeTarget}/>
                <p/>
                <Box sx={{maxWidth: '100%', margin: "auto"}} className="Filter">
                    <Button variant="contained">Отфильтровать</Button>
                </Box>
                <p/>
                <TextField fullWidth id="standard-basic" label="Поиск по имени" variant="outlined"
                           onChange={handleChangeTarget}/>
                <p/>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow
                                    key={row.name}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <p/>
                <Button variant="contained">Экспортировать данные</Button>
                <p/>
                <Statistic/>
            </Box>
        </div>
    );
}
