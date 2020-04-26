import React, { Component } from "react";
import axios from "axios";
import { Lesson } from "./styled-components/AllStyledComponents";
import { LOG_MATCHES } from "./../config/endpoints";
import { colors } from "./../config/colors";
import { ApiCalls } from "./../utils/apiCalls";
import _ from "lodash";

export default class Match extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstSelected: {},
      secondSelected: {},
      shuffled: [],
      data: [],
      paused: false,
      done: [],
      success: true,
      incorrect: false,
    };
  }

  componentDidMount() {
    console.log("mount");
    this.processData();
  }

  componentWillUnmount() {
    console.log("unm");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("cdu");
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.processData();
    }
  }

  processData = () => {
    console.log("UPDATE");
    const keys = [];
    const values = [];

    if (this.props.data.length) {
      this.props.data.forEach((d) => {
        keys.push({ id: d.id, w: d.word, type: "from" });
        values.push({ id: d.id, w: d.translation, type: "to" });
      });

      const shuffled = this.shuffle(keys.concat(values));
      console.log("shuffled", shuffled);
      this.setState({
        shuffled,
        data: this.props.data,
        done: [],
        success: true,
      });
    }
  };

  shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  selected = (x) => {
    if (this.state.paused) {
      return;
    }
    console.log("selected x", x);
    if (JSON.stringify(x) === JSON.stringify(this.state.firstSelected)) {
      this.setState({
        firstSelected: {},
      });
    } else {
      if (this.state.firstSelected.id) {
        this.evaluate(x);
        // this.setState({ secondSelected: x, paused: true }, () => {
        //   this.evaluate();
        // });
      } else {
        this.setState({
          firstSelected: x,
        });
      }
    }
  };

  evaluate = (x) => {
    const done = _.cloneDeep(this.state.done);
    let success = this.state.success;
    if (this.state.firstSelected.id === x.id) {
      console.log("correct");
      done.push(this.state.firstSelected.id);
      this.setState({ secondSelected: x, paused: true, incorrect: false });

      setTimeout(() => {
        this.evaluate2(done, success);
      }, 300);
    } else {
      console.log("incorrect");
      success = false;
      this.setState({ secondSelected: x, paused: true, incorrect: true });

      setTimeout(() => {
        this.evaluate2(done, success);
      }, 300);
    }
  };

  evaluate2 = (done, success) => {
    this.setState(
      {
        firstSelected: {},
        secondSelected: {},
        paused: false,
        done,
        success,
        incorrect: false,
      },
      () => {
        if (this.state.done.length === this.props.data.length) {
          this.logMatches(success);

          setTimeout(() => {
            this.props.refresh();
          }, 100);
        }
      }
    );
  };

  logMatches = async (success) => {
    const username = this.props.userSettings.username;
    const toLanguage = this.props.userSettings.toLanguage;
    const fromLanguage = this.props.userSettings.fromLanguage;
    const URL = LOG_MATCHES;

    await axios
      .post(
        URL,
        {
          username: username,
          fromLanguage: fromLanguage,
          toLanguage: toLanguage,
          success: success,
          position: this.props.position,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("response from log", response.data);
        if (response.data.position && response.data.moveSpeed) {
          this.props.changePositionAndMoveSpeed(
            response.data.position,
            response.data.moveSpeed
          );
        }
      });
  };

  render() {
    let lessonWidth = 680;
    // if (this.props.count > 4) {
    //   lessonWidth = 1020;
    // }
    let margins = 20;
    if (this.props.count > 6) {
      margins = 0;
    }

    console.log("match");

    return (
      <Lesson width={lessonWidth}>
        <div style={{ fontSize: "200%", marginBottom: margins }}></div>
        {this.props.values.length === 0 && !this.props.noData && (
          <div>LOADING...</div>
        )}
        {this.props.values.length === 0 && this.props.noData && (
          <div>
            We don't have any translations for this language combination. Please
            head over to{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => this.props.changePage("/settings/frequencies")}
            >
              Dictionary settings
            </span>{" "}
            and translate the pairs.
          </div>
        )}

        <div
          style={{
            paddingBottom: 100,
            paddingTop: 66,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {this.state.shuffled.map((x) => {
            if (this.state.done.includes(x.id)) {
              return (
                <div
                  key={`${x.id}-${x.type}`}
                  style={{
                    margin: 10,
                    padding: "5px 10px 8px 10px",
                    border: "1px solid grey",
                    borderRadius: "5px",
                    userSelect: "none",
                    background: "grey",
                  }}
                >
                  {x.w}
                </div>
              );
            }
            let selected = false;
            if (
              (x.id === this.state.firstSelected.id &&
                x.type === this.state.firstSelected.type) ||
              (x.id === this.state.secondSelected.id &&
                x.type === this.state.secondSelected.type)
            ) {
              selected = true;
            }
            return (
              <div
                key={`${x.id}-${x.type}`}
                style={{
                  cursor: this.state.paused ? "progress" : "pointer",
                  margin: 10,
                  padding: "5px 10px 8px 10px",
                  border: "1px solid grey",
                  borderRadius: "5px",
                  userSelect: "none",
                  background: selected
                    ? this.state.incorrect
                      ? "red"
                      : "green"
                    : "black",
                }}
                onClick={() => this.selected(x)}
              >
                {x.w}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 10, color: "#ccc" }}>
          Db lookup time: {this.props.lookupTime}s
        </div>
      </Lesson>
    );
  }
}
