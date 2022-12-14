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

    function resolveStatus(dateFrom, dateTo) {
        const now = new Date();
        if (now >= dateFrom && now <= dateTo) {
            return "В процессе";
        }

        if (now < dateFrom) {
            return "Не начат";
        }

        return "Окончен";
    }

    function onLinkPushed() {
        axios.post('http://localhost:3000/contests/parse', {link: link})
            .then(res => {
                const body = res.data
                setRow({
                    name: body.name,
                    dateFrom: body.dateFrom,
                    dateTo: body.dateTo,
                    status: resolveStatus(body.dateFrom, body.dateTo),
                    prize: body.prize.join(' \n'),
                    reporting: body.reporting.join(' \n'),
                    format: body.format,
                    requirements: body.requirements.map(req => `Ученая степень: ${req.academicDegree.join(' \n')},\n Гражданство: ${req.citizenship.join(' \n')}, \n Мин. возраст: ${req.ageMin}, \n Макс. возраст: ${req.ageMax}`).join('\n'),
                    city: body.city,
                    link: body.link,
                    links: body.links.map(li => `${li.text}:\n${li.link}`).join('\n'),
                });

                createAlert("Успех", successAlerts);
            })
            .catch(reason => createAlert(reason.response.data.message, errorAlerts));
    }

    function onUpdatePushed() {
        axios.put('http://localhost:3000/contests/upsert', row)
            .then(res => {
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
            <Box sx={{width: 1400, maxWidth: '80%', margin: "auto"}} className="Upload">
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
                                <TableCell align="left">{"Атрибут"}</TableCell>
                                <TableCell align="left">{"Значение"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(row).map((entry, index) => <TableRow key={index}
                                                                                 sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell sx={{width: 160}}> {columns[index]} </TableCell>
                                <TableCell><TextField multiline fullWidth={true} defaultValue={entry[1]}
                                                      onChange={event => {
                                                          const newRow = {...row};
                                                          newRow[entry[0]] = event.target;
                                                          setRow(newRow);
                                                      }}/> </TableCell>
                            </TableRow>)}

                        </TableBody>
                    </Table>
                </TableContainer>
                <p/>
                <Button variant="contained" onClick={onUpdatePushed}>Обновить данные</Button>
                <p/>
            </Box>
        </div>
    );
}
