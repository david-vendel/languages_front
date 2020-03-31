import React, { useState } from "react";
import { USER_SIGN_UP } from "../config/endpoints";
import axios from "axios";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import Authenticate from "./common/Authenticate";
import { ErrorDiv } from "./common/styled-components";
import Cookies from "universal-cookie";

const Td = styled.td`
  border: 0px;
`;

const Submit = styled.input`
  margin-top: 7px;
  padding: 2px 6px 2px 6px;
`;

const Input = styled.input`
  line-height: 1rem;
  padding-left: 3px;
  width: 65%;
`;

function SignUpForm(props) {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  let [error, setError] = useState(0);

  if (props.history.location.pathname !== "/signup") {
    props.history.push("/signup");
  }

  function keyPressed(e) {
    if (e.key === "Enter") {
      fireSignUp(e);
    }
  }

  function login() {
    props.changeRoute("login");
  }

  async function fireSignUp(event) {
    event.preventDefault();
    event.stopPropagation();

    const url = USER_SIGN_UP;

    const SignUpUserData = {
      username: name,
      email: email,
      password: pass
    };

    const data = JSON.stringify(SignUpUserData);
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .then(res => {
        // window.location.reload()
        console.log("res", res);

        // setTimeout(() => {
        //     props.history.push(comingFrom);
        // },100)

        const cookies = new Cookies();
        cookies.set("userToken", res.data.userToken, { path: "/" });
        console.log(cookies.get("userToken"));
        props.loginSuccess();
      })
      .catch(error => {
        console.error("I got error!", error, error.name + error.message);
        if (error.message.includes("401")) {
          setError(401);
        } else if (error.message.includes("303")) {
          setError(303);
        } else {
          setError(1);
        }
      });
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div style={{ padding: 20 }}>
        <h2 style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ cursor: "pointer", color: "blue" }} onClick={login}>
            LOGIN
          </span>{" "}
          <span style={{ textDecoration: "underline" }}>SIGN UP</span>
        </h2>
        <form>
          <table>
            <tbody>
              <tr>
                <Td>name: </Td>
                <Td>
                  <Input
                    tyle="text"
                    name="name"
                    autocomplete="username"
                    onChange={e => setName(e.target.value)}
                    onKeyPress={keyPressed}
                  />
                </Td>
              </tr>
              <tr>
                <Td>email: </Td>
                <Td>
                  <Input
                    tyle="text"
                    name="email"
                    autocomplete="email"
                    onChange={e => setEmail(e.target.value)}
                    onKeyPress={keyPressed}
                  />
                </Td>
              </tr>
              <tr>
                <Td>password: </Td>
                <Td>
                  <Input
                    type="password"
                    name="password"
                    autocomplete="current-password"
                    onChange={e => setPass(e.target.value)}
                    onKeyPress={keyPressed}
                  />
                </Td>
              </tr>
            </tbody>
          </table>
          <Submit type="submit" value="Sign Up" onClick={fireSignUp} />
        </form>
        {error === 1 && <Authenticate />}
        {error === 303 && <ErrorDiv>Username already exists!</ErrorDiv>}
        {error === 401 && <ErrorDiv>Bad credentials!</ErrorDiv>}
      </div>
    </div>
  );
}

export default withRouter(SignUpForm);
