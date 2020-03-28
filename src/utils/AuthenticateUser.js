import axios from "axios";
import { USER_LOGGED } from "../config/endpoints";
import Cookies from "universal-cookie";

async function authenticateUser() {
  /** *@returns boolean */
  const url = USER_LOGGED;
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
      return true;
    })
    .catch(error => {
      return false;
    });

  return ret;
}

export default authenticateUser;
