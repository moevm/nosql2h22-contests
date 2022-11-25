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

export default function Home() {
    const [link, setLink] = React.useState("");
    const [row, setRow] = React.useState({
        name: '',
        dateOfStart: '',
        dateOfEnd: '',
        location: '',
        sphere: '',
        status: ''
    });

    function newLink(event) {
        setLink(event.target.value);
    }

    const columns = [
        {
            label: 'Название конкурса'
        },
        {
            label: 'Дата начала'
        },
        {
            label: 'Дата окончания'
        },
        {
            label: 'Место проведения'
        },
        {
            label: 'Сфера'
        },
        {
            label: 'Статус'
        }
    ];

    function onLinkPushed() {
        setRow({
            name: 'Example',
            dateOfStart: 'Example',
            dateOfEnd: 'Example',
            location: 'Example',
            sphere: 'Example',
            status: 'Example',
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
                                    <TableCell align="right">{col.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={row.name}
                                      sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.dateOfStart}</TableCell>
                                <TableCell align="right">{row.dateOfEnd}</TableCell>
                                <TableCell align="right">{row.location}</TableCell>
                                <TableCell align="right">{row.sphere}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}
