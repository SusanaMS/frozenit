// doc
import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import { apiError } from "../common/api.js";

const MODEL_ENPOINT = "freezers";
const jwtToken = localStorage.getItem("jwtToken");
const freezerGet = document.getElementById("freezerGet");
const freezerBox = document.getElementById("freezerBox");
const freezerBoxMessage = document.getElementById("freezerBoxMessage");
const apiHeaders = new Headers();

freezerGet.addEventListener("click", processFreezerGet);

function processFreezerGet() {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    return;
  }
  new Promise((resolve) => {
    apiHeaders.append("Content-Type", API_CONTENT_TYPE);
    apiHeaders.append("Authorization", `Bearer ${jwtToken}`);
    freezerBox.classList.add("nothidden");
  }).then(
    getFreezersByUser(JSON.parse(localStorage.getItem("sessionUserInfo")).email)
  );
}

function getFreezersByUser(email) {
  const requestOptions = {
    method: "GET",
    headers: apiHeaders,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/${MODEL_ENPOINT}/email/${email}`;

  console.log(endpoint);

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      freezerBox.setAttribute("style", "display: flex");
      const jsonResult = JSON.parse(result);
      console.log(jsonResult);
      if (jsonResult != null && !jsonResult.error) {
        console.log("ok");
        if (!jsonResult.left) {
          apiError(
            false,
            freezerBoxMessage,
            endpoint,
            "no hay frigorificos asociados a su cuenta"
          );
        }
      } else {
        apiError(
          false,
          freezerBoxMessage,
          endpoint,
          jsonResult.error || "no se ha obtenido respuesta"
        );
      }
    })
    .catch((error) =>
      apiError(true, freezerBoxMessage, endpoint, error.message)
    );

  return null;
}
