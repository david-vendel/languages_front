const PRODUCTION_MODE = process.env.NODE_ENV === "production";

let SERVER = "http://localhost:6900";
if (PRODUCTION_MODE) {
  SERVER = "/back";
}

export const SERVER_URL = SERVER;

export const GET = `${SERVER}/get`;

export const USER_LOGGED = `${SERVER}/user-logged`;

export const USER_SIGN_UP = `${SERVER}/signup`;
export const USER_LOGIN = `${SERVER}/login`;
export const LOGOUT_USER = `${SERVER}/logout`;

export const USER_SETTINGS_GET = `${SERVER}/userSettings/get`;
export const USER_SETTINGS_SET = `${SERVER}/userSettings/set`;

export const SET_LANGUAGE_TO = `${SERVER}/setLanguageTo`;
export const GET_LANGUAGE_TO = `${SERVER}/getLanguageTo`;

export const LANGUAGES_GET_ALL = `${SERVER}/languages/get-all`;
export const LANGUAGES_DELETE = `${SERVER}/languages/delete`;
export const LANGUAGES = `${SERVER}/languages`;

export const GET_ALL_USERS = `${SERVER}/get-all`;
export const GET_USER = `${SERVER}/get`;
export const ADD_USER = `${SERVER}/add`;
export const DELETE_USER = `${SERVER}/delete`;

export const FREQUENCIES_TRANSLATE = `${SERVER}/frequencies/translate`;
export const TRANSLATE_ONE = `${SERVER}/translate/one`;
export const FREQUENCY_ADD = `${SERVER}/frequency/add`;
export const FREQUENCY_ADD_ARRAY = `${SERVER}/frequency/addArray`;
export const FREQUENCY_GET_ALL = `${SERVER}/frequencies/get-all`;

export const PAIR_EDIT = `${SERVER}/pair/edit`;
export const REMOVE_DUPLICATES = `${SERVER}/pair/flagDuos`;
export const PAIR_DELETE = `${SERVER}/pair/delete`;
export const PAIRS_GET_ALL = `${SERVER}/pairs/get-all`;

export const LOG_USER_ACTION = `${SERVER}/log/userAction`;
export const LOG_MATCHES = `${SERVER}/log/matches`;

export const USER_PROGRESS_GET_24 = `${SERVER}/log/userProgress24/get`;

export const USER_WORD_FLAG = `${SERVER}/userSettings/word/flag`;
export const USER_GET_ALL_FLAGGED = `${SERVER}/userSettings/flag/getAll`;

export const DICT_GET_TOTALWORDS = `${SERVER}/dict/totalWords/get`;

export const FIRE = `${SERVER}/all-translations/fire`;

export const OXFORD = `${SERVER}/oxford/scrap`;
