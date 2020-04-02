import React, { Component } from "react";
import axios from "axios";
import {
  Table,
  Grid,
  Box,
  Boss
} from "./styled-components/AllStyledComponents";
import Cookies from "universal-cookie";
import { LOG_USER_ACTION, USER_PROGRESS_GET_24 } from "./../config/endpoints";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      keys: [],
      values: [],
      choice: 0,
      backs: ["", "", "", ""],
      correct: 0,
      incorrect: 0,
      count: this.props.userSettings.choicesCount
    };
  }

  componentDidMount() {
    this.getUserProgress24();

    this.refresh();
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

  refresh = async () => {
    const username = this.props.userSettings.username;
    console.log("refresh");
    const count = this.state.count;

    const URL = `http://localhost:8000/get/${username}/${count}`;

    const response = await axios.get(URL, {});

    const lookupTime = response.data.lookupTime;
    let data = response.data.pairs;
    console.log("all data", data, typeof data);

    let keys = [];
    let values = [];

    data.forEach(d => {
      if (d) {
        keys.push(d.word);
        values.push(d.translation);
      }
    });

    console.log("keys", keys);
    console.log("keys", values);

    const choice = Math.floor(Math.random() * keys.length);
    let backs = ["", "", "", ""];

    this.setState({
      data,
      keys,
      values,
      choice,
      backs,
      lookupTime
    });
  };

  clickedWord = (e, i) => {
    let backs = ["", "", "", ""];
    console.log(
      "clicked ",
      i,
      typeof i,
      this.state.choice,
      this.state.data,
      this.state.keys,
      this.state.values
    );
    if (i === this.state.choice) {
      backs[i] = "green";
      this.logUserAction("choiceClicked", this.state.keys[i], true);
      this.setState({
        backs,
        correct: this.state.correct + 1
      });
    } else {
      backs[i] = "red";
      this.logUserAction("choiceClicked", this.state.keys[i], false);

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
          action: action
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
    return (
      <Boss>
        <div>
          {this.state.correct} / {this.state.incorrect}{" "}
        </div>
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
        <div style={{ margin: 10, padding: 10 }}>
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
        </div>
        {/*<button style={{marginBottom:10}} onClick={this.refresh}>Refresh</button>*/}
        <div style={{ fontSize: "200%", marginBottom: 20 }}>
          {this.state.keys[this.state.choice]}
        </div>
        <Grid>
          {this.state.values.map((d, i) => {
            return (
              <Box
                key={i}
                style={{
                  paddingLeft: 10,
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
      </Boss>
    );
  }
}
