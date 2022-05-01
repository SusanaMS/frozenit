import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import {
  apiError,
  jsonArray2htmlTable,
  array2option,
  checkJWT,
  getUserEmail,
} from "../common/utils.js";

const MODEL_ENPOINT = "records";
const jwtToken = localStorage.getItem("jwtToken");
const recordGet = document.getElementById("recordGet");
const recordBox = document.getElementById("recordBox");
const recordBoxMessage = document.getElementById("recordBoxMessage");
const recordAdd = document.getElementById("recordAdd");
const recordBoxAdd = document.getElementById("recordBoxAdd");
const recordFreezer = document.getElementById("recordFreezer");
const recordFood = document.getElementById("recordFood");
const recordAddErrorMessage = document.getElementById("recordAddErrorMessage");
const addRecordForm = document.getElementById("addRecordForm");

let apiHeaders;

recordGet.addEventListener("click", processRecordGet);
recordAdd.addEventListener("click", clickRecordAdd);

function processRecordGet(event) {
  console.log("entroo!!");
  if (!checkJWT(jwtToken)) {
    return null;
  }

  const email = getUserEmail();
  if (email == null) {
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

function recordFreezerSelect(email) {
  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const requestOptions = {
    method: "GET",
    headers: apiHeaders,
    redirect: "follow",
  };

  // necesitamos para las select del formulario tanto el congelador
  // como el alimento, ya que son PK de la tabla destino junto con la id de user

  const endpoint = `${BASE_ENDPOINT}/freezers/email/${email}`;

  console.log(endpoint, requestOptions);
  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      if (jsonResult.error != null) {
        apiError(false, recordAddErrorMessage, endpoint, jsonResult.error);
      } else {
        console.log(jsonResult);
        const userFreezers = jsonResult.map(({ name_freezer }) => name_freezer);
        array2option(userFreezers, recordFreezer);
      }
    })
    .catch((error) => {
      apiError(true, recordAddErrorMessage, endpoint, error.message);
    });
}

function recordFoodSelect() {
  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const requestOptions = {
    method: "GET",
    headers: apiHeaders,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/foods/all`;

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      if (jsonResult.error != null) {
        apiError(false, recordAddErrorMessage, endpoint, jsonResult.error);
      } else {
        console.log(jsonResult);
        const foods = jsonResult.map(({ name_food }) => name_food);
        array2option(foods, recordFood);
      }
    })
    .catch((error) => {
      apiError(true, recordAddErrorMessage, endpoint, error.message);
    });
}

function clickRecordAdd(event) {
  if (!checkJWT(jwtToken)) {
    return null;
  }

  const email = getUserEmail();
  if (email == null) {
    return null;
  }

  Promise.all([recordFreezerSelect(email), recordFoodSelect()]).then(
    recordBoxAdd.setAttribute("style", "display: flex")
  );

  event.preventDefault();
}
