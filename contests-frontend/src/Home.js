import React, {useReducer} from "react";
import {
    Alert,
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
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [successAlerts] = React.useState([]);
    const [errorAlerts] = React.useState([]);
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
        link: '',
        links: '',
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
        'Формат',
        'Требования',
        'Город',
        'Ссылка',
        'Ссылки на документы',
    ];

    function onLinkPushed() {
        axios.post('http://localhost:3000/contests/parse', {link: link})
            .then(res => {
                console.log(res)
                const body = res.data
                setRow({
                    name: body.name,
                    dateFrom: body.dateFrom,
                    dateTo: body.dateTo,
                    status: '',
                    prize: body.prize,
                    reporting: body.reporting,
                    format: body.format,
                    requirements: body.requirements,
                    city: body.city,
                    link: body.link,
                    links: body.links.map(li => `${li.text}:\n${li.link}`).join('\n'),
                });

                createAlert("Успех", successAlerts);
            })
            .catch(reason => createAlert(reason.response.data.message, errorAlerts));
    }

    function createAlert(message, alerts) {
        alerts.push(message);
        setTimeout(() => {
            alerts.shift();
            forceUpdate();
        }, 2000)
        forceUpdate();
    }

    return (
        <div className="App">
            <Box sx={{width: 1200, maxWidth: '80%', margin: "auto"}} className="Upload">
                <TextField fullWidth id="standard-basic" label="Ссылка" variant="outlined" onChange={newLink}/>
                <p/>
                <Button variant="contained" onClick={onLinkPushed}>Загрузить</Button>
                <p/>
                {successAlerts.map(alert => (<Alert severity="success">{alert}</Alert>))}
                {errorAlerts.map(alert => (<Alert severity="error">{alert}</Alert>))}
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
                                {Object.entries(row).map(entry => <TableCell align="right">{entry[1]}</TableCell>)}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}
