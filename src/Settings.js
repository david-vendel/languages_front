import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";
import axios from "axios";
import All from "./components/All";
import AllPairs from "./components/AllPairs";
import { withStackContext } from "./utils/StackProvider";
import GOOGLE_TRANSLATE_API_KEY from "./secrets/apiKeys";

const ALREADY_EXISTS = "ALREADY_EXISTS";

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      word: "",
      id: "",
      frequencies: []
    };
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
      array: arr
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

  getAll = async e => {
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
          frequencies: response.data
        });
      });
  };

  translateThisWord = word => {
    let fromLang = "en";
    let toLang = "fr";

    let url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    url += "&q=" + encodeURI(word);
    url += `&source=${fromLang}`;
    url += `&target=${toLang}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log("response from google: ", response);
      })
      .catch(error => {
        console.log("There was an error with the translation request: ", error);
      });
  };

  frequenciesTranslate = async () => {
    const URL = `http://localhost:8000/frequencies/translate`;
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
        this.setState({});
      });
  };

  render() {
    console.log("url", this.props.history.location);
    return (
      <div className="App" style={{ position: "relative" }}>
        <div
          style={{ position: "absolute", top: 0, right: 5, cursor: "pointer" }}
          onClick={() => {
            window.location.href = "/setup";
          }}
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
          <button type="submit" onClick={this.getAll}>
            {" "}
            get all{" "}
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
