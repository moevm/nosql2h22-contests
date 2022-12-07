import React from "react";

import MUIDataTable from "mui-datatables";

import {Alert, Box, Button, Input} from "@mui/material";
import axios from "axios";
import Statistic from "./Statistic";

export default function Database() {
    const [data, setData] = React.useState([]);
    const [firstRequest, setFirstRequest] = React.useState(true);
    const [allCount, setAllCount] = React.useState(0);
    const [file, setFile] = React.useState(undefined);
    const [successAlerts, setSuccessAlerts] = React.useState([]);
    const [errorAlerts, setErrorAlerts] = React.useState([]);

    function updateFirstData() {
        if (firstRequest) {
            updateCount()
            updateData(0, 10);
            setFirstRequest(false);
        }
    }

    function createSuccessAlert(message) {
        setSuccessAlerts([...successAlerts, message]);
        setTimeout(() => {
            const copy = [...successAlerts];
            copy.shift();
            setSuccessAlerts(copy);
        }, 5000)
    }

    function createErrorAlert(message) {
        setErrorAlerts([...errorAlerts, message]);
        setTimeout(() => {
            const copy = [...errorAlerts];
            copy.shift();
            setErrorAlerts(copy);
        }, 5000)
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
        'Ссылка',
        'Ссылки на документы'
    ];

    function updateData(page, rows) {
        axios.get('http://localhost:3000/contests/', {
            params: {
                page: page,
                count: rows,
            }
        })
            .then(res => {
                updateDataWithNewDto(res.data);
            })
            .catch(reason => createErrorAlert(reason.response.data.message));
    }

    function updateCount() {
        axios.get('http://localhost:3000/contests/count')
            .then(res => setAllCount(res.data))
            .catch(reason => createErrorAlert(reason.response.data.message));
    }

    function search(searchText) {
        axios.get('http://localhost:3000/contests/', {
            params: {
                filter: searchText,
                page: 0,
                count: 0,
            }
        }).then(res => {
            updateDataWithNewDto(res.data);
            createSuccessAlert("Успех");
        }).catch(reason => createErrorAlert(reason.response.data.message));
    }

    function updateDataWithNewDto(dto) {
        const newData = [];
        dto.forEach(entry => {
            newData.push([
                entry.name,
                entry.time,
                entry.time,
                '',
                entry.prizes,
                '',
                '',
                '',
                '',
                '',
                entry.city,
                '',
                entry.link,
                entry.links.map(li => `${li.text}:\n${li.link}`).join('\n')])
        });
        setData(newData);
    }

    function onFileChange(event) {
        setFile(event.target.files[0]);
    }

    function onFileUpload() {
        if (file !== undefined) {
            const formData = new FormData();

            formData.append("file", file);

            axios.post('http://localhost:3000/contests/import', formData)
                .then(() => createSuccessAlert("Успех"))
                .catch(reason => createErrorAlert(reason.response.data.message));
        }
    }

    updateFirstData();

    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive: 'standard',
        rowsPerPageOptions: [1, 3, 5, 10, 20],
        jumpToPage: true,
        serverSide: true,
        count: allCount,
        onTableChange: (action, tableState) => {
            console.log(action, tableState);

            switch (action) {
                case 'changePage':
                case 'changeRowsPerPage':
                case 'onSearchClose':
                    updateData(tableState.page, tableState.rowsPerPage);
                    break;
                case 'search':
                    if (tableState.searchText != null && tableState.searchText.length > 2) {
                        search(tableState.searchText)
                    }
                    break;
                default:
                    console.log('action not handled.');
            }
        },

    };

    return (
        <Box sx={{width: 1200, maxWidth: '80%', margin: "auto"}} className="Upload">
            {successAlerts.map(alert => (<Alert severity="success">{alert}</Alert>))}
            {errorAlerts.map(alert => (<Alert severity="error">{alert}</Alert>))}
            <MUIDataTable title={'Contests'} data={data} columns={columns} options={options}/>
            <p/>
            <Button variant="contained" href="http://localhost:3000/contests/export">Экспорт</Button>
            <p/>
            <div>
                <Input type="file" onChange={onFileChange}/>
                <Button onClick={onFileUpload}>Upload</Button>
            </div>
            <p/>
            <Statistic/>
        </Box>
    );
}
