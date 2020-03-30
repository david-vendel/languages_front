const PRODUCTION_MODE = process.env.NODE_ENV === "production";

let SERVER = "http://localhost:8000";
if (PRODUCTION_MODE) {
  SERVER = "";
}

export const SERVER_URL = SERVER;

export const USER_LOGGED = `${SERVER}/user-logged`;

export const USER_SIGN_UP = `${SERVER}/signup`;
export const USER_LOGIN = `${SERVER}/login`;
export const LOGOUT_USER = `${SERVER}/logout`;

export const USER_SETTINGS_GET = `${SERVER}/userSettings/get`;
export const USER_SETTINGS_SET = `${SERVER}/userSettings/set`;

export const SET_LANGUAGE_TO = `${SERVER}/setLanguageTo`;
export const GET_LANGUAGE_TO = `${SERVER}/getLanguageTo`;

export const GET_ALL_USERS = `${SERVER}/get-all`;
export const GET_USER = `${SERVER}/get`;
export const ADD_USER = `${SERVER}/add`;
export const DELETE_USER = `${SERVER}/delete`;
