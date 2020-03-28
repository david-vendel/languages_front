import React from 'react';
import Routes from "./utils/Routes";
import {BrowserRouter} from "react-router-dom";
import ContextProvider from "./utils/ContextProvider"

const RouterWrapper = () => {
    return (
        <BrowserRouter>
            <ContextProvider>
                <Routes />
            </ContextProvider>
        </BrowserRouter>
    )};

export default RouterWrapper