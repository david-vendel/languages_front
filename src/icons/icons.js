import React from "react";
import saveIcon from "./save.svg";
import dataIcon from "./data.svg";

export function saveIconComponent (dim) {
    return( ()=> wrapper( <img alt={"saveIcon"} src={saveIcon} />, dim) )
}

export function dataIconComponent (dim) {
    return( ()=> wrapper( <img alt={"dataIcon"} src={dataIcon} />, dim) )
}

function wrapper (component, dim) {
    return (
        <div style={{width:dim, height:dim, opacity: 0.8}}>
            {component}
        </div>
    )
}