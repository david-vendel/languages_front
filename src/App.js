import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";
import axios from "axios";
import All from "./components/All";
import { withStackContext } from "./utils/StackProvider";
import { LANGUAGES } from "./config/endpoints";
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "GTM-5X6PWKH",
};

TagManager.initialize(tagManagerArgs);

const ALREADY_EXISTS = "ALREADY_EXISTS";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      word: "",
      translation: "",
    };
  }

  changeWord = (event) => {
    this.setState({
      word: event.target.value,
    });
  };

  changeTranslation = (event) => {
    this.setState({
      translation: event.target.value,
    });
  };

  clearInput = () => {
    this.setState({
      word: "",
      translation: "",
    });
  };

  changePage = (pathName) => {
    this.props.history.push(pathName);
  };

  sendAdd = async (e, type = "add") => {
    console.log("sendAdd", this.state.word, this.state.translation);
    const URL = `${LANGUAGES}/${type}`;
    console.log("URL", URL);
    // const URL = `http://localhost:8000/languages/add/${this.state.addKey}/${this.state.addValue}`;
    // const response = await axios.get(URL, {});
    //
    // let data = response.data;

    const data = {
      word: this.state.word,
      translation: this.state.translation,
    };

    await axios
      .post(URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
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
      id: this.state.id + 1,
    });

    this.clearInput();
  };

  render() {
    console.log("url", this.props.history.location);
    return (
      <div className="App" style={{ position: "relative" }}>
        <div style={{ display: "flex" }}>
          <All
            id={this.state.id}
            changeUserSettings={this.props.changeUserSettings}
            userSettings={this.props.userSettings}
            changePage={this.changePage}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(withStackContext(App));
