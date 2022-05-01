import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import {
  apiError,
  jsonArray2htmlTable,
  array2option,
  checkJWT,
} from "../common/utils.js";

const MODEL_ENPOINT = "records";
const jwtToken = localStorage.getItem("jwtToken");
const recordGet = document.getElementById("recordGet");
const recordBox = document.getElementById("recordBox");
const recordBoxMessage = document.getElementById("recordBoxMessage");

let apiHeaders;

recordGet.addEventListener("click", processRecordGet);

function processRecordGet(event) {
  console.log("entroo!!");
  if (!checkJWT(jwtToken)) {
    return null;
  }

  const email = JSON.parse(localStorage.getItem("sessionUserInfo")).email;

  if (email == null) {
    console.error("No se puede obtener el mail de usuario");
    window.alert("Error al obtener el id de usuario");
    return null;
  }

  apiHeaders = new Headers();
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const requestOptions = {
    method: "GET",
    headers: apiHeaders,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/${MODEL_ENPOINT}/email/${email}`;

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      recordBox.setAttribute("style", "display: flex");
      const jsonResult = JSON.parse(result);
      console.debug(jsonResult);
      if (jsonResult != null && !jsonResult.error) {
        if (!jsonResult.length) {
          apiError(
            false,
            recordBoxMessage,
            endpoint,
            "no hay registros asociados a su cuenta"
          );
        } else {
          const element = document.getElementById("recordTable");
          if (element != null) {
            element.remove();
          }

          const htmlTable = jsonArray2htmlTable(
            jsonResult,
            "recordTable",
            null
          );

          recordBox.appendChild(htmlTable);
        }
      } else {
        apiError(
          false,
          recordBoxMessage,
          endpoint,
          jsonResult.error || "no se ha obtenido respuesta"
        );
      }
    })
    .catch((error) =>
      apiError(true, recordBoxMessage, endpoint, error.message)
    );

  event.preventDefault();
}
