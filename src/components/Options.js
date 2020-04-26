import React, { Component } from "react";
import axios from "axios";
import {
  Table,
  Grid,
  Box,
  Boss,
  Lesson,
  Good,
  Bad,
  None,
} from "./styled-components/AllStyledComponents";
import Cookies from "universal-cookie";
import {
  GET,
  LOG_USER_ACTION,
  USER_PROGRESS_GET_24,
} from "./../config/endpoints";
import { colors } from "./../config/colors";
import { ApiCalls } from "./../utils/apiCalls";

export default class Options extends Component {
  render() {
    const apiCalls = new ApiCalls();

    let lessonWidth = 680;
    if (this.props.count > 4) {
      lessonWidth = 1020;
    }
    let margins = 20;
    if (this.props.count > 6) {
      margins = 0;
    }
    return (
      <Lesson width={lessonWidth}>
        <div style={{ fontSize: "200%", marginBottom: margins }}>
          <span
            style={{
              float: "left",
              cursor: "pointer",
              color: this.props.fromArchive ? colors.inactive : colors.blue,
            }}
            onClick={() => {
              if (!this.props.fromArchive) {
                this.props.refresh(true);
              }
            }}
            title={"I won't show this word again"}
          >
            {"<"}
          </span>
          {this.props.keys[this.props.choice]}{" "}
          <span
            style={{ float: "right", cursor: "pointer", color: colors.flag }}
            onClick={() => {
              apiCalls.flagWord(
                this.props.userSettings.username,
                this.props.userSettings.fromLanguage,
                this.props.data[this.props.choice].id,
                this.props.data[this.props.choice].word,
                true
              );
              this.props.refresh();
            }}
            title={"I won't show this word again"}
          >
            x
          </span>
        </div>
        {this.props.values.length === 0 && !this.props.noData && (
          <div>LOADING...</div>
        )}
        {this.props.values.length === 0 && this.props.noData && (
          <div>
            We don't have any translations for this language combination. Please
            head over to{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => this.props.changePage("/settings/frequencies")}
            >
              Dictionary settings
            </span>{" "}
            and translate the pairs.
          </div>
        )}
        <Grid>
          {this.props.values.map((d, i) => {
            return (
              <Box
                key={i}
                margin={margins}
                style={{
                  backgroundColor: this.props.backs[i],
                }}
                onClick={(e) => {
                  this.props.clickedWord(e, i);
                }}
              >
                {d}
              </Box>
            );
          })}
        </Grid>
        <div style={{ fontSize: 10, color: "#ccc" }}>
          Db lookup time: {this.props.lookupTime}s
        </div>
      </Lesson>
    );
  }
}
