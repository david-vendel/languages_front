import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";
import axios from "axios";
import All from "./components/All";
import AllPairs from "./components/AllPairs";
import { withStackContext } from "./utils/StackProvider";
import { GOOGLE_TRANSLATE_API_KEY } from "./secrets/apiKeys";
import { CenterFlexDiv } from "./components/styled-components/AllStyledComponents";
import {
  PAIR_EDIT,
  FREQUENCIES_TRANSLATE,
  TRANSLATE_ONE
} from "./config/endpoints";
const ALREADY_EXISTS = "ALREADY_EXISTS";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyIndex: 0, //to force rerender of keys when I need to update values
      word: "",
      id: "",
      frequencies: [],
      pairs: []
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.userSettings.toLanguage !==
        prevProps.userSettings.toLanguage ||
      this.props.userSettings.fromLanguage !==
        prevProps.userSettings.fromLanguage
    ) {
      if (this.state.frequencies.length) {
        this.getAllFrequencies();
      }
      if (this.state.pairs.length) {
        this.getAllPairs();
      }
    }
  }

  clearInput = () => {
    this.setState({
      word: "",
      id: ""
    });
  };

  changeId = event => {
    this.setState({
      id: event.target.value
    });
  };

  changeWord = event => {
    this.setState({
      word: event.target.value
    });
  };

  sendAdd = async (e, type = "add") => {
    console.log("sendAdd", this.state.id, this.state.word);
    const URL = `http://localhost:8000/frequency/add`;
    console.log("URL", URL);

    const data = {
      id: this.state.id,
      word: this.state.word
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

    console.log("data", data);

    this.clearInput();
  };

  upload = e => {
    console.log("upload", e);
    try {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = async e => {
        const text = e.target.result;
        console.log(text.split("\r\n"));
        this.sendFrequencyArray(text.split("\r\n"));
      };
      reader.readAsText(e.target.files[0]);
    } catch (err) {
      console.error("upload error", err);
      // this.props.value.addNotification('error', 'Upload error', 'See console for more details.', 5000)
    }
  };

  sendFrequencyArray = async arr => {
    console.log("sendFrequencyArray", arr);
    const URL = `http://localhost:8000/frequency/addArray`;
    console.log("URL", URL);

    const data = {
      array: arr,
      fromLanguage: "en",
      toLanguage: "fr"
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

  getAllFrequencies = async e => {
    const URL = `http://localhost:8000/frequencies/get-all`;
    console.log("URL", URL);

    await axios
      .post(
        URL,
        {},
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
          frequencies: response.data,
          pairs: []
        });
      });
  };

  getAllPairs = async e => {
    const URL = `http://localhost:8000/pairs/get-all`;
    console.log("URL", URL);

    const username = this.props.userSettings.username;
    console.log("username", username);
    await axios
      .post(
        URL,
        { username: username },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )
      .then(response => {
        console.log("response", response.data);
        const pairs = response.data;
        pairs.forEach(element => {
          element.ref = React.createRef();
        });
        this.setState(
          {
            pairs,
            frequencies: []
          },
          () => {
            console.log("this.state.pairs", this.state.pairs);
          }
        );
      });
  };

  translateThisWord = async word => {
    let fromLanguage = this.props.userSettings.fromLanguage;
    let toLanguage = this.props.userSettings.toLanguage;

    const URL = TRANSLATE_ONE;

    return await axios
      .post(
        URL,
        { fromLanguage: fromLanguage, toLanguage: toLanguage, word: word },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )
      .then(response => {
        console.log("response", response);
        console.log(
          "response",
          response.data.data.translations[0].translatedText
        );
        return response.data.data.translations[0].translatedText;
        //this.setState({});
      });
  };

  frequenciesTranslate = async () => {
    const URL = FREQUENCIES_TRANSLATE;
    console.log("URL", URL);

    const fromLanguage = this.props.userSettings.fromLanguage;
    const toLanguage = this.props.userSettings.toLanguage;
    console.log("this.props", this.props, toLanguage);

    await axios
      .post(
        URL,
        { fromLanguage: fromLanguage, toLanguage: toLanguage },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )
      .then(response => {
        console.log("response", response.data);
        this.setState({});
      });
  };

  saveTranslation = async id => {
    const URL = PAIR_EDIT;

    const fromLanguage = this.props.userSettings.fromLanguage;
    const toLanguage = this.props.userSettings.toLanguage;

    console.log(
      "save translation",
      id,
      this.state.pairs[id].ref.current.innerText
    );

    const data = {
      fromLanguage: fromLanguage,
      toLanguage: toLanguage,
      translation: this.state.pairs[id].ref.current.innerText,
      id: id
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
        this.setState({});
      });
  };

  cancelTranslation = () => {
    console.log("cancel edit");
    // this.getAllPairs();
    this.setState({
      keyIndex: this.state.keyIndex + 1
    });
  };

  translationKeyDown = (id, e) => {
    console.log("id, e", id, e.keyCode);
    if (e.keyCode === 13) {
      e.preventDefault();
      this.saveTranslation(id);
      this.state.pairs[id].ref.current.blur();
    }
  };

  doGoogleTranslation = async (id, word) => {
    const translation = await this.translateThisWord(word);
    console.log("translation:", translation);
    const pairs = this.state.pairs;
    pairs[id].translation = translation;
    this.setState({ pairs });
    //data.translations[0]   .translatedText;
  };

  render() {
    console.log("url", this.props.history.location);
    console.log("props", this.props);

    return (
      <div className="App" style={{ position: "relative" }}>
        <div
          style={{ position: "absolute", top: 0, right: 5, cursor: "pointer" }}
          onClick={() => {}}
        >
          Dictionary setup
        </div>

        <div style={{ marginTop: 20 }}>
          Add&nbsp;
          <input onChange={this.changeId} value={this.state.id} />
          <input onChange={this.changeWord} value={this.state.word} />
          <input
            type="submit"
            onClick={this.clearInput}
            value="X"
            style={{ marginLeft: -1 }}
          />
          <button type="submit" onClick={this.sendAdd}>
            {" "}
            SUBMIT{" "}
          </button>
          &nbsp;
          <button type="submit" onClick={this.getAllFrequencies}>
            {" "}
            get all frequencies{" "}
          </button>
          &nbsp;
          <button type="submit" onClick={this.getAllPairs}>
            {" "}
            get all pairs{" "}
          </button>
          <div>
            Here upload frequency file. One word per line, ordered:&nbsp;
            <input
              type="file"
              name={"upload"}
              id={"upload"}
              onChange={e => this.upload(e)}
            />
          </div>
        </div>

        {this.state.frequencies.length ? (
          <div>
            {this.state.frequencies.map(f => {
              return (
                <div
                  key={f.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => this.translateThisWord(f.word)}
                >
                  {f.word}
                </div>
              );
            })}
          </div>
        ) : null}

        {this.state.pairs.length ? (
          <CenterFlexDiv>
            <table>
              <tbody>
                {this.state.pairs.map(f => {
                  return (
                    <tr key={this.state.keyIndex + "-" + f.id}>
                      <td>{f.word}</td>
                      <td
                        ref={f.ref}
                        contentEditable={true}
                        suppressContentEditableWarning={"true"}
                        onClick={() => {
                          console.log("clicked", f.id);
                        }}
                        onKeyDown={e => {
                          this.translationKeyDown(f.id, e);
                        }}
                      >
                        {f.translation}
                      </td>
                      <td
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          this.saveTranslation(f.id);
                        }}
                      >
                        save{" "}
                      </td>
                      <td
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          this.cancelTranslation();
                        }}
                      >
                        cancel{" "}
                      </td>
                      <td
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          this.doGoogleTranslation(f.id, f.word);
                        }}
                      >
                        GTrans{" "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CenterFlexDiv>
        ) : null}

        <div>
          {" "}
          <button onClick={this.frequenciesTranslate}>
            Translate Frequencies
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(withStackContext(Settings));
