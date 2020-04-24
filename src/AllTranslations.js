import React, { Component } from "react";
import axios from "axios";

import { FIRE } from "./config/endpoints";

class AllTranslations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "apple",
      translations: [],
      waiting: false,
    };
  }

  fire = async () => {
    const URL = FIRE;

    const data = {
      word: this.state.word,
      languages: this.state.languages,
    };

    console.log("call api", this.state.word);

    this.setState({
      waiting: true,
      translations: [],
    });

    await axios
      .post(
        URL,
        {
          word: this.state.word,
          languages: this.state.languages,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("response", response.data);
        this.setState({
          translations: response.data,
          waiting: false,
        });
      });
  };

  keyPressed = (e) => {
    if (e.key === "Enter") {
      this.fire(e);
    }
  };

  render() {
    return (
      <div style={{ margin: 20 }}>
        <div>All Translations</div>
        <div>
          <input
            tyle="text"
            name="name"
            value={this.state.word}
            onChange={(e) => this.setState({ word: e.target.value })}
            onKeyPress={this.keyPressed}
          />
          <button type="submit" onClick={this.fire}>
            Translate!
          </button>
        </div>
        <div style={{ marginTop: 10 }}>
          <table>
            {" "}
            <tbody>
              {this.state.translations.map((t, i) => {
                return (
                  <tr key={i}>
                    <td>{t.language}</td>
                    <td style={{ paddingLeft: 10 }}> {t.languageName}</td>
                    <td style={{ paddingLeft: 15 }}>{t.translation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {this.state.waiting && (
            <div>Loading.... Translating to 103 languages takes time!</div>
          )}
        </div>
      </div>
    );
  }
}
export default AllTranslations;
