import React from "react";

import MUIDataTable from "mui-datatables";

import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import Statistic from "./Statistic";

export const data = [
    ['Московская олимпиада по математике', '2022.12.12', '2022.12.15', 'Москва', 'Математика', 'Предстоит'],
    ['Московская олимпиада по математике', '2022.12.12', '2022.12.15', 'Москва', 'Математика', 'Завершен'],
    ['Олимпиада по русскому языку', '2022.12.12', '2022.12.15', 'Таганрог', 'Русский язык', 'Идёт'],
];

export default function Database() {
    const [ageFilterChecked, setAgeFilterChecked] = React.useState(false);

    const columns = [
        {
            label: 'Название конкурса',
            name: 'Name',
            options: {
                filter: true,
                filterOptions: {
                    renderValue: v => v ? v.replace(/^(\w).* (.*)$/, '$1. $2') : ''
                },
                filterType: 'dropdown'
            },
        },
        {
            label: 'Дата начала',
            name: 'DateOfStart',
            options: {
                filter: true,
                customFilterListOptions: {
                    render: v => v.toLowerCase()
                },
            },
        },
        {
            label: 'Дата окончания',
            name: 'DateOfEnd',
            options: {
                filter: true,
                customFilterListOptions: {
                    render: v => v.toLowerCase()
                },
            },
        },
        {
            label: 'Место проведения',
            name: 'Location',
            options: {
                filter: true,
                display: 'true',
                filterType: 'custom',
                customFilterListOptions: {
                    render: v => v.map(l => l.toUpperCase()),
                    update: (filterList, filterPos, index) => {
                        console.log('update');
                        console.log(filterList, filterPos, index);
                        filterList[index].splice(filterPos, 1);
                        return filterList;
                    }
                },
                filterOptions: {
                    logic: (location, filters, row) => {
                        return filters.length ? !filters.includes(location) : false;
                    },
                    display: (filterList, onChange, index, column) => {
                        const optionValues = ['Москва', 'Санкт-Петербург', 'Таганрог'];
                        return (
                            <FormControl>
                                <InputLabel htmlFor='select-multiple-chip'>
                                    {column.label}
                                </InputLabel>
                                <Select multiple
                                        value={filterList[index]}
                                        renderValue={selected => selected.join(', ')}
                                        onChange={event => {
                                            filterList[index] = event.target.value;
                                            onChange(filterList[index], index, column);
                                        }}>
                                    {optionValues.map(item => (
                                        <MenuItem key={item} value={item}>
                                            <Checkbox
                                                color='primary'
                                                checked={filterList[index].indexOf(item) > -1}
                                            />
                                            <ListItemText primary={item}/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        );
                    }
                }
            }
        },
        {
            label: 'Сфера',
            name: 'TargetKnowledge',
            options: {
                filter: true,
                filterType: 'custom',

                // if the below value is set, these values will be used every time the table is rendered.
                // it's best to let the table internally manage the filterList
                //filterList: [25, 50],

                customFilterListOptions: {
                    render: v => {
                        if (v[0] && v[1] && ageFilterChecked) {
                            return [`Min Age: ${v[0]}`, `Max Age: ${v[1]}`];
                        } else if (v[0] && v[1] && !ageFilterChecked) {
                            return `Min Age: ${v[0]}, Max Age: ${v[1]}`;
                        } else if (v[0]) {
                            return `Min Age: ${v[0]}`;
                        } else if (v[1]) {
                            return `Max Age: ${v[1]}`;
                        }
                        return [];
                    },
                    update: (filterList, filterPos, index) => {
                        console.log('customFilterListOnDelete: ', filterList, filterPos, index);

                        if (filterPos === 0) {
                            filterList[index].splice(filterPos, 1, '');
                        } else if (filterPos === 1) {
                            filterList[index].splice(filterPos, 1);
                        } else if (filterPos === -1) {
                            filterList[index] = [];
                        }

                        return filterList;
                    },
                },
                filterOptions: {
                    names: [],
                    logic(age, filters) {
                        if (filters[0] && filters[1]) {
                            return age < filters[0] || age > filters[1];
                        } else if (filters[0]) {
                            return age < filters[0];
                        } else if (filters[1]) {
                            return age > filters[1];
                        }
                        return false;
                    },
                    display: (filterList, onChange, index, column) => (
                        <div>
                            <FormLabel>{column.label}</FormLabel>
                            <FormGroup row>
                                <TextField
                                    label='min'
                                    value={filterList[index][0] || ''}
                                    onChange={event => {
                                        filterList[index][0] = event.target.value;
                                        onChange(filterList[index], index, column);
                                    }}
                                    style={{width: '45%', marginRight: '5%'}}
                                />
                                <TextField
                                    label='max'
                                    value={filterList[index][1] || ''}
                                    onChange={event => {
                                        filterList[index][1] = event.target.value;
                                        onChange(filterList[index], index, column);
                                    }}
                                    style={{width: '45%'}}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={ageFilterChecked}
                                            onChange={event => setAgeFilterChecked(event.target.checked)}
                                        />
                                    }
                                    label='Separate Values'
                                    style={{marginLeft: '0px'}}
                                />
                            </FormGroup>
                        </div>
                    ),
                },
                print: false,
            },
        },
        {
            label: 'Статус',
            name: 'Status',
            options: {
                filter: true,
                filterType: 'checkbox',
                filterOptions: {
                    names: ['Предстоит', 'Завершен', 'Идёт'],
                    logic(status, filterVal) {
                        return status === filterVal;
                    },
                },
                sort: false,
            },
        },
    ];

    const options = {
        filter: true,
        filterType: 'multiselect',
        responsive: 'standard',
        setFilterChipProps: (colIndex, colName, data) => {
            return {
                color: 'primary',
                variant: 'outlined',
                className: 'testClass123',
            };
        }
    };

    return (
        <Box sx={{width: 1200, maxWidth: '80%', margin: "auto"}} className="Upload">
            <MUIDataTable title={'Contests'} data={data} columns={columns} options={options}/>
            <p/>
            <Statistic columns={columns}/>
        </Box>
    );
}
