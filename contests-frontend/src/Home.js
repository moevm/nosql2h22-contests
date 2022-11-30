import React from "react";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import axios from "axios";

export default function Home() {
    const [link, setLink] = React.useState("");
    const [row, setRow] = React.useState({
        name: '',
        dateFrom: '',
        dateTo: '',
        status: '',
        prize: '',
        reporting: '',
        deadline: '',
        format: '',
        signatures: '',
        city: '',
        sphere: '',
        link: ''
    });

    function newLink(event) {
        setLink(event.target.value);
    }

    const columns = [
        'Название',
        'Дата начала',
        'Дата конца',
        'Статус',
        'Награда',
        'Отчетность',
        'Податься до',
        'Формат',
        'Подписи',
        'Требования',
        'Город',
        'Сфера',
        'Ссылка'
    ];

    function onLinkPushed() {
        axios.post(`http://localhost:3000/contests/parse`, {link: link})
            .then(res => {
                const body = res.data
                setRow({
                    name: body.name,
                    dateFrom: body.time,
                    dateTo: body.time,
                    status: '',
                    prize: body.prizes,
                    reporting: '',
                    deadline: '',
                    format: '',
                    signatures: '',
                    city: '',
                    sphere: '',
                    link: ''
                });
            });
    }

    return (
        <div className="App">
            <Box sx={{width: 1200, maxWidth: '80%', margin: "auto"}} className="Upload">
                <TextField fullWidth id="standard-basic" label="Ссылка" variant="outlined" onChange={newLink}/>
                <p/>
                <Button variant="contained" onClick={onLinkPushed}>Загрузить</Button>
                <p/>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columns.map(col => (
                                    <TableCell align="right">{col}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={row.name}
                                      sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.dateFrom}</TableCell>
                                <TableCell align="right">{row.dateTo}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                                <TableCell align="right">{row.prize}</TableCell>
                                <TableCell align="right">{row.reporting}</TableCell>
                                <TableCell align="right">{row.deadline}</TableCell>
                                <TableCell align="right">{row.format}</TableCell>
                                <TableCell align="right">{row.signatures}</TableCell>
                                <TableCell align="right">{row.city}</TableCell>
                                <TableCell align="right">{row.sphere}</TableCell>
                                <TableCell align="right">{row.link}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}
