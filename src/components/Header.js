import React, { Fragment } from "react";
import axios from "axios";
import { LOGOUT_USER } from "../config/endpoints";
import styled from "styled-components";
import Cookies from "universal-cookie";

const Button = styled.button`
  opacity: 0.8;
  cursor: pointer;
  border-radius: 20px;
  padding-left: 10px;
  padding-right: 10px;
  margin: 0px 0px 0px 0px;
`;

const Templates = styled(Button)`
  float: left;
  margin-right: 5px;
`;

const Users = styled(Button)`
  float: left;
`;

const Logout = styled(Button)`
  float: right;
`;

const HeaderDiv = styled.div`
  width: 100%;
  background: #333;
  overflow: auto;
`;

//logoutCall makes api call to logout
//doLogout is callback that tells routes.js that user has logged out.
async function logoutCall(doLogout) {
  // await axios({
  //     method: 'get',
  //     url: LOGOUT_USER,

  //     withCredentials: true,
  // })
  //     .then(
  //         doLogout()
  //     )
  //     .catch((error) => {
  //         console.error("error",error)
  //     });
  const url = LOGOUT_USER;
  const cookies = new Cookies();
  const data = { auth: cookies.get("userToken") };
  const ret = await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
    .then(() => {
      console.log("logout call success");
      doLogout();
      return true;
    })
    .catch(error => {
      console.log("logout call error");
      return false;
    });
}

// makes a logout available for every route (for logged in users)
function Header({ properties, Component, doLogout }) {
  const menuClick = direction => {
    properties.history.push(direction);
  };

  return (
    <Fragment>
      <HeaderDiv>
        <Templates
          onClick={() => {
            menuClick("/templates");
          }}
        >
          Templates
        </Templates>
        <Users
          onClick={() => {
            menuClick("/users");
          }}
        >
          Users
        </Users>

        <Logout
          onClick={() => {
            logoutCall(doLogout);
          }}
        >
          LOGOUT
        </Logout>
      </HeaderDiv>
      <div style={{ marginTop: 10, clear: "both" }}>
        <Component routerHistory={properties.history} />
      </div>
    </Fragment>
  );
}

export default Header;
