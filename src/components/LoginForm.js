import React, { useState } from "react";
import { USER_LOGIN } from "../config/endpoints";
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

function LoginForm(props) {
  let [name, setName] = useState("");
  let [pass, setPass] = useState("");
  let [error, setError] = useState(0);

  if (props.history.location.pathname !== "/login") {
    props.history.push("/login");
  }

  function keyPressed(e) {
    if (e.key === "Enter") {
      fireLogin(e);
    }
  }

  async function fireLogin(event) {
    event.preventDefault();
    event.stopPropagation();

    const url = USER_LOGIN;

    const LoginUserData = {
      username: name,
      password: pass
    };

    //         const data = new FormData();
    //         data.append('data', JSON.stringify(LoginUserData));
    // console.log("data",data)
    const data = JSON.stringify(LoginUserData);
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
        <h2>LOGIN</h2>
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
          <Submit type="submit" value="Log in" onClick={fireLogin} />
        </form>
        {error === 1 && <Authenticate />}
        {error === 401 && <ErrorDiv>Bad credentials!</ErrorDiv>}
      </div>
    </div>
  );
}

export default withRouter(LoginForm);
