import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";
import axios from "axios";
import All from "./components/All";
import AllPairs from "./components/AllPairs";
import { withStackContext } from "./utils/StackProvider";

const ALREADY_EXISTS = "ALREADY_EXISTS";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      word: "",
      translation: "",
      allPairs: []
    };
  }

  changeWord = event => {
    this.setState({
      word: event.target.value
    });
  };

  changeTranslation = event => {
    this.setState({
      translation: event.target.value
    });
  };

  clearInput = () => {
    this.setState({
      word: "",
      translation: ""
    });
  };

  sendAdd = async (e, type = "add") => {
    console.log("sendAdd", this.state.word, this.state.translation);
    const URL = `http://localhost:8000/languages/${type}`;
    console.log("URL", URL);
    // const URL = `http://localhost:8000/languages/add/${this.state.addKey}/${this.state.addValue}`;
    // const response = await axios.get(URL, {});
    //
    // let data = response.data;

    const data = {
      word: this.state.word,
      translation: this.state.translation
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

        if (type === "edit") {
          console.log("wont edit again");
          return;
        }
        if (response.data === ALREADY_EXISTS) {
          this.sendAdd(null, "edit");
        } else {
          console.log(type, "succeeded");
        }
      });

    console.log("data", data);

    this.setState({
      id: this.state.id + 1
    });

    this.clearInput();
  };

  getAll = async e => {
    const URL = `http://localhost:8000/languages/get-all`;
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
          allPairs: response.data
        });
      });
  };

  render() {
    console.log("url", this.props.history.location);
    return (
      <div className="App" style={{ position: "relative" }}>
        <div
          style={{ position: "absolute", top: 0, right: 5, cursor: "pointer" }}
          onClick={() => {
            //window.location.href = "/settings";
            this.props.history.push("/settings");
          }}
        >
          Dictionary settins
        </div>

        <div style={{ marginTop: 20 }}>
          Add&nbsp;
          <input onChange={this.changeWord} value={this.state.word} />
          <input
            onChange={this.changeTranslation}
            value={this.state.translation}
          />
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
        </div>

        <div style={{ display: "flex" }}>
          <All
            id={this.state.id}
            currentLanguageTo={this.props.currentLanguageTo}
          />
          <AllPairs allPairs={this.state.allPairs} />
        </div>
      </div>
    );
  }
}

export default withRouter(withStackContext(App));
