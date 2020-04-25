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

    // axios
    //   .post(
    //     URL,
    //     {
    //       word: this.state.word,
    //       languages: this.state.languages,
    //       part: 1,
    //       outOf: 2,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       withCredentials: true,
    //     }
    //   )
    //   .then((response) => {
    //     console.log("response", response.data);
    //     this.setState({
    //       translations: response.data,
    //       waiting: false,
    //     });
    //   });

    const n = 15;
    for (let i = 1; i <= n; i++) {
      setTimeout(() => {
        axios
          .post(
            URL,
            {
              word: this.state.word,
              languages: this.state.languages,
              part: i,
              outOf: n,
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
              translations: this.state.translations.concat(response.data),
              waiting: false,
            });
          });
      }, i * 200);
    }
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
            onChange={(e) =>
              this.setState({ word: e.target.value.slice(0, 20) })
            }
            onKeyPress={this.keyPressed}
          />
          <button type="submit" onClick={this.fire}>
            Translate!
          </button>
        </div>
        <div
          style={{
            marginTop: 11,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <div key={1} style={{ marginLeft: 20, marginRight: 20 }}>
            <table>
              {" "}
              <tbody>
                {this.state.translations
                  .slice(0, Math.ceil(this.state.translations.length / 2))
                  .map((t, i) => {
                    return (
                      <tr key={i}>
                        <td>{t.language}</td>
                        <td style={{ paddingLeft: 10, minWidth: 155 }}>
                          {" "}
                          {t.languageName}
                        </td>
                        <td style={{ paddingLeft: 15 }}>{t.translation}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div key={2} style={{ marginLeft: 20, marginRight: 20 }}>
            <table>
              {" "}
              <tbody>
                {this.state.translations
                  .slice(
                    Math.ceil(this.state.translations.length / 2),
                    this.state.translations.length
                  )
                  .map((t, i) => {
                    return (
                      <tr key={i}>
                        <td>{t.language}</td>
                        <td style={{ paddingLeft: 10, minWidth: 155 }}>
                          {" "}
                          {t.languageName}
                        </td>
                        <td style={{ paddingLeft: 15 }}>{t.translation}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {this.state.waiting && (
            <div>Loading.... Translating to 103 languages takes time!</div>
          )}
        </div>
      </div>
    );
  }
}
export default AllTranslations;
