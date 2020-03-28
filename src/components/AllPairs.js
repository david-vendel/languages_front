import React, { Component } from "react";
import axios from "axios";
import { Line } from "./styled-components/AllStyledComponents";

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
      incorrect: 0
    };
  }

  deletePair = async word => {
    console.log("pair", word);

    console.log("deletePair", word);
    const URL = `http://localhost:8000/languages/delete/${word}`;
    console.log("URL", URL);

    const data = {
      word: word
    };

    await axios
      .post(URL, data, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .then(response => {
        console.log("response", response.data);
      });
  };

  render() {
    if (this.props.allPairs.length === 0) {
      return null;
    }
    return (
      <div
        style={{
          paddingTop: 15,
          paddingBottom: 10,
          maxWidth: 600,
          margin: "0 auto"
        }}
      >
        All word pairs:
        <table>
          <tbody>
            {this.props.allPairs.map((d, i) => {
              return (
                <tr
                  key={i}
                  style={{
                    paddingLeft: 10,
                    backgroundColor: this.state.backs[i]
                  }}
                >
                  <td>{d.word} </td>
                  <td> {d.translation} </td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.deletePair(d.word);
                    }}
                  >
                    x
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
