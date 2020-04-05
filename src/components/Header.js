import React, { Fragment, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

import {
  LOGOUT_USER,
  USER_SETTINGS_GET,
  USER_SETTINGS_SET
} from "../config/endpoints";
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

const Language = styled.select`
  margin-bottom: 2px;
`;

const FloatRight = styled(Button)`
  float: right;
`;

const Right = styled.span`
  float: right;
  color: #bbb;
  margin-right: 10px;
`;

const HeaderDiv = styled.div`
  width: 100%;
  background: #333;
  overflow: auto;
`;

//logoutCall makes api call to logout
//doLogout is callback that tells routes.js that user has logged out.
async function logoutCall(doLogout) {
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

//get user settings data from db, typeArr is array of types of what kind of settings we want
const getUserSettings = async typeArr => {
  const url = USER_SETTINGS_GET;
  const cookies = new Cookies();
  const data = { auth: cookies.get("userToken") };

  //   if (type === "toLanguage") {
  //   }
  //   if (type === "choicesCount") {
  //   }
  data.type = JSON.stringify(typeArr);
  const ret = await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
    .then(response => {
      console.log("getUserSettings call success", response.data);
      return response.data;
    })
    .catch(error => {
      console.log("getUserSettings call error");
      return false;
    });

  return ret;
};

// makes a logout available for every route (for logged in users)
function Header({ properties, Component, doLogout }) {
  console.log("Header rerender");
  const menuClick = direction => {
    properties.history.push(direction);
  };

  const languagesTo = [
    { symbol: "fr", name: "Fr" },
    { symbol: "de", name: "De" },
    { symbol: "es", name: "Es" },
    { symbol: "sk", name: "Sk" },
    { symbol: "cs", name: "Cz" }
  ];

  const [userSettings, setUserSettings] = React.useState({
    username: "?",
    choicesCount: 4,
    toLanguage: "fr",
    fromLanguage: "en",
    flaggedWords: []
  });

  const [currentLanguageFrom, setCurrentLanguageFrom] = React.useState("en");

  async function fetchMyAPI() {
    const userData = await getUserSettings([
      "username",
      "toLanguage",
      "fromLanguage",
      "choicesCount",
      "flaggedWords"
    ]);

    setUserSettings(userData);

    const languageTo = userData.toLanguage;
    const username = userData.username;
    console.log("userData", userData);
    console.log("languagetTo", languageTo);
    //setCurrentLanguageTo(languageTo);
    //setusername(username);
  }

  useEffect(() => {
    fetchMyAPI();
  }, []);

  const changeUserSettings = async (type, value) => {
    console.log("e value", value);
    const cookies = new Cookies();

    const data = {
      auth: cookies.get("userToken"),
      type: type,
      setting: value
    };
    const url = USER_SETTINGS_SET;

    const ret = await axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .then(() => {
        console.log("language to call success");
        fetchMyAPI();
        return true;
      })
      .catch(error => {
        console.log("language to call error");
        return false;
      });
  };

  const refreshUserSettings = () => {
    fetchMyAPI();
  };

  console.log(">>> current user settings", userSettings);
  if (userSettings.username === "?") {
    return <div>LOADING...</div>;
  }
  console.log("<<");
  return (
    <Fragment>
      <HeaderDiv>
        <Templates
          onClick={() => {
            menuClick("/");
          }}
        >
          Home
        </Templates>
        <Language id="language-from">
          <option value="en" defaultValue={userSettings.fromLanguage}>
            En
          </option>
        </Language>
        =>
        <Language
          id="language-to"
          defaultValue={userSettings.toLanguage}
          onChange={e => changeUserSettings("toLanguage", e.target.value)}
        >
          {languagesTo.map(l => {
            return (
              <option
                key={l.symbol}
                value={l.symbol}
                // selected={l.symbol == currentLanguageTo ? "selected" : ""}
              >
                {l.name}
              </option>
            );
          })}
        </Language>
        <FloatRight
          onClick={() => {
            logoutCall(doLogout);
          }}
        >
          LOGOUT
        </FloatRight>
        <Right>Hi, {userSettings.username}</Right>
        <FloatRight
          onClick={() => {
            //window.location.href = "/settings";
            properties.history.push("/settings");
          }}
        >
          Dictionary settins
        </FloatRight>
      </HeaderDiv>
      <div style={{ clear: "both" }}>
        <Component
          routerHistory={properties.history}
          userSettings={userSettings}
          changeUserSettings={changeUserSettings}
          refreshUserSettings={refreshUserSettings}
        />
      </div>
    </Fragment>
  );
}

export default withRouter(Header);
