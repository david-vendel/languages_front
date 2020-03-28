import {SERVER_URL} from "../../config/endpoints";
import React from "react";
import {ErrorDiv} from "./styled-components";

export default function Authenticate () {

    return (
        <ErrorDiv link={true}
                  className={"inputOpacity-password"}
                  onClick={() => {
                      window.open(SERVER_URL, "_blank")
                  }}>
            Authenticate!
        </ErrorDiv>)
}