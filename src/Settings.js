import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";
import axios from "axios";
import All from "./components/All";
import AllPairs from "./components/AllPairs";
import { withStackContext } from "./utils/StackProvider";

const ALREADY_EXISTS = "ALREADY_EXISTS";

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      word: "",
      id: ""
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
      </div>
    );
  }
}

export default withRouter(withStackContext(Settings));
