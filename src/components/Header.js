import React, { Fragment, useEffect } from "react";
import axios from "axios";
import {
  LOGOUT_USER,
  GET_LANGUAGE_TO,
  SET_LANGUAGE_TO
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

const getLanguageTo = async () => {
  const url = GET_LANGUAGE_TO;
  const cookies = new Cookies();
  const data = { auth: cookies.get("userToken") };

  const ret = await axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
    .then(response => {
      console.log("getLanguageTo call success", response.data.languageTo);
      return response.data.languageTo;
    })
    .catch(error => {
      console.log("getLanguageTo call error");
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
    { symbol: "cz", name: "Cz" }
  ];

  const [currentLanguageTo, setCurrentLanguageTo] = React.useState("fr");

  async function fetchMyAPI() {
    let languageTo = await getLanguageTo();
    console.log("languagetTo", languageTo);
    setCurrentLanguageTo(languageTo);
  }

  useEffect(() => {
    fetchMyAPI();
  }, []);

  const changedLanguagesTo = async e => {
    console.log("e", e.target.value);
    const cookies = new Cookies();

    const data = {
      auth: cookies.get("userToken"),
      languageTo: e.target.value
    };
    const url = SET_LANGUAGE_TO;

    const ret = await axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .then(() => {
        console.log("language to call success");
        return true;
      })
      .catch(error => {
        console.log("language to call error");
        return false;
      });
  };

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
          <option value="en">En</option>
        </Language>
        =>
        <Language id="language-to" onChange={changedLanguagesTo}>
          {languagesTo.map(l => {
            return (
              <option
                key={l.symbol}
                value={l.symbol}
                selected={l.symbol == currentLanguageTo ? "selected" : ""}
              >
                {l.name}
              </option>
            );
          })}
        </Language>
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
