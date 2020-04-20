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
  None
} from "./styled-components/AllStyledComponents";
import Cookies from "universal-cookie";
import {
  GET,
  LOG_USER_ACTION,
  USER_PROGRESS_GET_24
} from "./../config/endpoints";
import { colors } from "./../config/colors";
import { ApiCalls } from "./../utils/apiCalls";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      noData: false,
      keys: [],
      values: [],
      choice: 0,
      backs: ["", "", "", ""],
      correct: 0,
      incorrect: 0,
      count: this.props.userSettings.choicesCount,
      position: this.props.userSettings.position,
      moveSpeed: this.props.userSettings.moveSpeed,
      directionFromTo: true,
      archive: [],
      archivedChoices: [],
      fromArchive: true,
      goodBad: []
    };
  }

  componentDidMount() {
    this.getUserProgress24();

    this.refresh(false);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("this.props", this.props)
    //     if (this.props.id !== prevProps.id) {
    //         setTimeout(() => {this.refresh()}, 100)
    //     }
    console.log("this.props", this.props);
    if (
      this.props.userSettings.toLanguage !==
        prevProps.userSettings.toLanguage ||
      this.props.userSettings.fromLanguage !==
        prevProps.userSettings.fromLanguage
    ) {
      this.getUserProgress24();

      this.refresh();
    }
  }

  refresh = async (fromArchive = false) => {
    const username = this.props.userSettings.username;
    const position = this.state.position;
    console.log("refresh");
    const count = this.state.count;

    const URL = GET;

    let response = null;
    console.log("this.state.archive", this.state.archive);
    if (fromArchive) {
      response = this.state.archive[this.state.archive.length - 2];
    } else {
      response = await axios
        .post(
          URL,
          {
            username: username,
            count: count,
            position: position
          },
          {
            headers: {
              "Content-Type": "application/json"
            },
            withCredentials: true
          }
        )
        .then(response => {
          console.log("response", response.data);
          return response;
        });
    }

    let archive = this.state.archive;
    if (!fromArchive) {
      archive.push(response);
    }

    console.log(">>>Response", response);

    if (!response || !response.data) {
      console.log("you cannot go back");
      return;
    }

    const lookupTime = response.data.lookupTime;
    const noData = response.data.noData;

    let data = response.data.pairs;
    console.log("all data", data, typeof data);

    let keys = [];
    let values = [];

    if (this.state.directionFromTo) {
      data.forEach(d => {
        if (d) {
          keys.push(d.word);
          values.push(d.translation);
        }
      });
    } else {
      data.forEach(d => {
        if (d) {
          keys.push(d.translation);
          values.push(d.word);
        }
      });
    }

    console.log("keys", keys);
    console.log("keys", values);

    let choice = Math.floor(Math.random() * keys.length);
    let archivedChoices = this.state.archivedChoices;
    const goodBad = data[choice].goodBad;

    if (!fromArchive) {
      archivedChoices.push(choice);
    } else {
      choice = this.state.archivedChoices[
        this.state.archivedChoices.length - 2
      ];
    }

    let backs = [];
    for (let i = 0; i < this.state.count; i++) {
      backs.push("");
    }

    this.setState(
      {
        data,
        keys,
        values,
        choice,
        backs,
        lookupTime,
        noData,
        archive,
        archivedChoices,
        fromArchive,
        goodBad
      },
      () => {
        console.log("archived,", this.state.archive);
      }
    );
  };

  clickedWord = (e, i) => {
    const backs = this.state.backs;

    console.log(
      "clicked ",
      i,
      typeof i,
      this.state.choice,
      this.state.data,
      this.state.keys,
      this.state.values
    );

    let loggedWord = this.state.keys[this.state.choice];
    if (!this.state.directionFromTo) {
      loggedWord = this.state.values[this.state.choice];
    }

    if (i === this.state.choice) {
      backs[i] = "green";
      this.logUserAction("choiceClicked", loggedWord, true);
      this.setState({
        backs,
        correct: this.state.correct + 1
      });
    } else {
      backs[i] = "red";
      this.logUserAction("choiceClicked", loggedWord, false);

      this.setState({
        backs,
        incorrect: this.state.incorrect + 1
      });
    }

    setTimeout(() => {
      this.refresh();
    }, 500);
  };

  logUserAction = async (action, word, success) => {
    const username = this.props.userSettings.username;
    const toLanguage = this.props.userSettings.toLanguage;
    const fromLanguage = this.props.userSettings.fromLanguage;
    const URL = LOG_USER_ACTION;

    await axios
      .post(
        URL,
        {
          username: username,
          fromLanguage: fromLanguage,
          toLanguage: toLanguage,
          word: word,
          success: success,
          action: action,
          position: this.state.position
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )
      .then(response => {
        console.log("response", response.data);
        this.setState({
          position: response.data.position,
          moveSpeed: response.data.moveSpeed
        });
      });
  };

  getUserProgress24 = async () => {
    const username = this.props.userSettings.username;
    const toLanguage = this.props.userSettings.toLanguage;
    const fromLanguage = this.props.userSettings.fromLanguage;
    const URL = USER_PROGRESS_GET_24;

    await axios
      .post(
        URL,
        {
          username: username,
          fromLanguage: fromLanguage,
          toLanguage: toLanguage
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )
      .then(response => {
        const correct = response.data.last24hours.good;
        const incorrect = response.data.last24hours.bad;
        this.setState({ correct, incorrect });
      });
  };

  render() {
    const apiCalls = new ApiCalls();
    console.log("this.state.data", this.state.data);
    console.log("this.state.backs", this.state.backs);

    const countsArr = [];
    for (let i = 2; i <= 20; i++) {
      countsArr.push(i);
    }
    const together = this.state.correct + this.state.incorrect;
    const correct100 = Math.ceil((100 * this.state.correct) / together);
    const incorrect100 = 100 - correct100;
    console.log("cor inc", correct100, incorrect100);

    let lessonWidth = 680;
    if (this.state.count > 4) {
      lessonWidth = 1020;
    }
    let margins = 20;
    if (this.state.count > 6) {
      margins = 0;
    }
    return (
      <Boss>
        <div style={{ display: "flex" }}>
          <div
            style={{
              height: 5,
              backgroundColor: "green",
              width: `${correct100}%`
            }}
          ></div>
          <div
            style={{
              height: 5,
              backgroundColor: "red",
              width: `${incorrect100}%`
            }}
          ></div>
        </div>
        <div>
          {this.state.correct} / {this.state.incorrect} |{" "}
          <span title={`word ${this.state.position}`}>
            lvl {Math.ceil(this.state.position / 100)}
          </span>
        </div>
        <div
          style={{
            margin: 10,
            padding: 10,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{ cursor: "pointer", paddingLeft: 10, width: "70px" }}
            onClick={() => {
              this.setState(
                { directionFromTo: !this.state.directionFromTo },
                () => {
                  this.refresh();
                }
              );
            }}
          >
            (swap)
          </div>

          <div>
            count:{" "}
            <select
              defaultValue={this.state.count}
              onChange={e => {
                this.setState({ count: e.target.value }, () => {
                  this.refresh();
                  this.props.changeUserSettings(
                    "choicesCount",
                    this.state.count
                  );
                });
              }}
            >
              {countsArr.map(c => {
                //   if (c === this.state.count) {
                //     return (
                //       <option key={c} selected>
                //         {c}
                //       </option>
                //     );
                //   }
                return <option key={c}>{c}</option>;
              })}
            </select>
          </div>

          <div style={{ justifyContent: "flex-end", display: "flex" }}>
            {this.state.goodBad.length ? (
              [-1, -1, -1, -1, -1]
                .concat(this.state.goodBad)
                .slice(-5)
                .map(gb => {
                  if (gb === 1) {
                    return <Good></Good>;
                  } else if (gb === -1) {
                    return <None></None>;
                  } else {
                    return <Bad></Bad>;
                  }
                })
            ) : (
              <span style={{ color: "orange", fontWeight: 600 }}>
                {" "}
                New word!{" "}
              </span>
            )}
          </div>
        </div>
        <div>
          {this.state.moveSpeed > 20 ? (
            <span>
              I am evaluating your level. Keep going...{" "}
              {100 - this.state.moveSpeed / 2.5}%
            </span>
          ) : null}
        </div>
        {/*<button style={{marginBottom:10}} onClick={this.refresh}>Refresh</button>*/}

        <Lesson width={lessonWidth}>
          <div style={{ fontSize: "200%", marginBottom: margins }}>
            <span
              style={{
                float: "left",
                cursor: "pointer",
                color: this.state.fromArchive ? colors.inactive : colors.blue
              }}
              onClick={() => {
                if (!this.state.fromArchive) {
                  this.refresh(true);
                }
              }}
              title={"I won't show this word again"}
            >
              {"<"}
            </span>
            {this.state.keys[this.state.choice]}{" "}
            <span
              style={{ float: "right", cursor: "pointer", color: colors.flag }}
              onClick={() => {
                apiCalls.flagWord(
                  this.props.userSettings.username,
                  this.props.userSettings.fromLanguage,
                  this.state.data[this.state.choice].id,
                  this.state.data[this.state.choice].word,
                  true
                );
                this.refresh();
              }}
              title={"I won't show this word again"}
            >
              x
            </span>
          </div>
          {this.state.values.length === 0 && !this.state.noData && (
            <div>LOADING...</div>
          )}
          {this.state.values.length === 0 && this.state.noData && (
            <div>
              We don't have any translations for this language combination.
              Please head over to{" "}
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
            {this.state.values.map((d, i) => {
              return (
                <Box
                  key={i}
                  margin={margins}
                  style={{
                    backgroundColor: this.state.backs[i]
                  }}
                  onClick={e => {
                    this.clickedWord(e, i);
                  }}
                >
                  {d}
                </Box>
              );
            })}
          </Grid>
          <div style={{ fontSize: 10, color: "#ccc" }}>
            Db lookup time: {this.state.lookupTime}s
          </div>
        </Lesson>
      </Boss>
    );
  }
}
