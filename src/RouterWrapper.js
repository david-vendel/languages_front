import React from "react";
import Routes from "./utils/Routes";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./utils/ContextProvider";
// import GA from "utils/GoogleAnalytics";

const RouterWrapper = () => {
  return (
    <BrowserRouter>
      {/* {GA.init() && <GA.RouteTracker />} */}
      <ContextProvider>
        <Routes />
      </ContextProvider>
    </BrowserRouter>
  );
};

export default RouterWrapper;
