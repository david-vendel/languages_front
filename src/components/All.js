import React, { Component } from "react";
import axios from "axios";
import {
  Table,
  Grid,
  Box,
  Boss
} from "./styled-components/AllStyledComponents";
import Cookies from "universal-cookie";

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
      count: this.props.choicesCount
    };
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("this.props", this.props)
    //     if (this.props.id !== prevProps.id) {
    //         setTimeout(() => {this.refresh()}, 100)
    //     }
    console.log("this.props", this.props);
    if (
      this.props.userSettings.toLanguage !== prevProps.userSettings.toLanguage
    ) {
      this.refresh();
    }
  }

  refresh = async () => {
    const username = this.props.userSettings.username;
    console.log("refresh");
    // const URL = `http://localhost:8000/get-all`;
    const count = this.state.count;

    const URL = `http://localhost:8000/get/${username}/${count}`;

    const response = await axios.get(URL, {});

    let data = response.data;
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
      backs
    });
  };

  clickedWord = (e, i) => {
    let backs = ["", "", "", ""];
    console.log("clicked ", i, typeof i);
    if (i === this.state.choice) {
      backs[i] = "green";
      console.log("backs", backs);
      this.setState({
        backs,
        correct: this.state.correct + 1
      });
    } else {
      backs[i] = "red";
      this.setState({
        backs,
        incorrect: this.state.incorrect + 1
      });
    }

    setTimeout(() => {
      this.refresh();
    }, 500);
  };

  render() {
    console.log("this.state.data", this.state.data);
    console.log("this.state.backs", this.state.backs);

    const countsArr = [
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20
    ];
    return (
      <Boss>
        <div style={{ margin: 10, padding: 10 }}>
          {this.state.correct} / {this.state.incorrect} count:{" "}
          <select
            defaultValue={4}
            onChange={e => {
              this.setState({ count: e.target.value }, () => {
                this.refresh();
                this.props.changeUserSettings("choicesCount", this.state.count);
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
      </Boss>
    );
  }
}
