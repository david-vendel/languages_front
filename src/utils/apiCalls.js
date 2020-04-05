import { USER_WORD_FLAG } from "./../config/endpoints";
import axios from "axios";

export class ApiCalls {
  //positive: if false, will unflag word
  flagWord = async (username, fromLanguage, id, word, positive) => {
    const URL = USER_WORD_FLAG;

    return await axios
      .post(
        URL,
        {
          username: username,
          fromLanguage: fromLanguage,
          id: id,
          word: word,
          positive: positive
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )
      .then(response => {
        console.log("response", response);
        return response;
      });
  };
}
