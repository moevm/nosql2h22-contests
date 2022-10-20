import React from "react";
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Database from "./Database";

import Home from "./Home";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";

export default function App() {
    return (
        <div className="root">
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static">
                    <Toolbar sx={{margin: "auto"}}>
                        <Button variant="contained"
                                sx={{background: "gray", marginRight: "50px", marginLeft: "50px"}}
                                href={"database"}>
                            База данных
                        </Button>
                        <Typography variant="h6"
                                    component="div"
                                    sx={{flexGrow: 1, marginRight: "50px", marginLeft: "50px"}}>
                            Конкурсы и гранты
                        </Typography>
                        <Button variant="contained"
                                sx={{background: "gray", marginRight: "50px", marginLeft: "50px"}}
                                href={"/"}>
                            На главную
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <p/>

            <BrowserRouter>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="database" element={<Database/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
