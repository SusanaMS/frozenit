import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import {
  apiError,
  jsonArray2htmlTable,
  array2option,
  checkJWT,
  getUserEmail,
} from "../common/utils.js";

const MODEL_ENPOINT = "records",
  jwtToken = localStorage.getItem("jwtToken"),
  recordGet = document.getElementById("recordGet"),
  recordBox = document.getElementById("recordBox"),
  recordTable = document.getElementById("recordTable"),
  recordBoxMessage = document.getElementById("recordBoxMessage"),
  recordAdd = document.getElementById("recordAdd"),
  recordBoxAdd = document.getElementById("recordBoxAdd"),
  recordFreezer = document.getElementById("recordFreezer"),
  recordFood = document.getElementById("recordFood"),
  recordFreezeDate = document.getElementById("recordFreezeDate"),
  recordAddErrorMessage = document.getElementById("recordAddErrorMessage"),
  addRecordForm = document.getElementById("addRecordForm");

let apiHeaders;

recordGet.addEventListener("click", processRecordGet);
recordAdd.addEventListener("click", clickRecordAdd);
addRecordForm.addEventListener("submit", processRecordAdd);

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
          recordTable.innerHTML = "";
          jsonArray2htmlTable(recordTable, jsonResult, null);
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

async function recordFreezerSelect(email) {
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

  let userFreezers;

  // https://stackoverflow.com/questions/59650572/how-to-wait-for-response-of-fetch-in-async-function
  console.log(endpoint, requestOptions);
  const fecthFreezers = async (args) => {
    const res = await fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const jsonResult = JSON.parse(result);
        if (jsonResult.error != null) {
          apiError(false, recordAddErrorMessage, endpoint, jsonResult.error);
        } else {
          console.log(jsonResult);
          userFreezers = jsonResult.map(({ name_freezer }) => name_freezer);
          array2option(userFreezers, recordFreezer);
        }
      })
      .catch((error) => {
        apiError(true, recordAddErrorMessage, endpoint, error.message);
      });
  };

  const data = await fecthFreezers();
  console.log(":::>", userFreezers);

  return userFreezers;
}

async function recordFoodSelect() {
  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const requestOptions = {
    method: "GET",
    headers: apiHeaders,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/foods/all`;

  let foods;

  const fecthFoods = async (args) => {
    const res = await fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const jsonResult = JSON.parse(result);
        if (jsonResult.error != null) {
          apiError(false, recordAddErrorMessage, endpoint, jsonResult.error);
        } else {
          console.log(jsonResult);
          foods = jsonResult.map(({ name_food }) => name_food);
          array2option(foods, recordFood);
          return foods;
        }
      })
      .catch((error) => {
        apiError(true, recordAddErrorMessage, endpoint, error.message);
      });
  };

  const data = await fecthFoods();
  console.log(":::>", foods);

  return foods;
}

function clickRecordAdd(event) {
  if (!checkJWT(jwtToken)) {
    return null;
  }

  const email = getUserEmail();
  if (email == null) {
    return null;
  }

  recordFreezeDate.valueOf().value = new Date().toISOString().slice(0, 10);

  Promise.all([recordFreezerSelect(email), recordFoodSelect()]).then(
    (selectValues) => {
      console.log("------->", selectValues);
      recordBoxAdd.setAttribute("style", "display: flex");
    }
  );

  event.preventDefault();
}

function processRecordAdd(even) {
  if (!checkJWT(jwtToken)) {
    return null;
  }

  const email = getUserEmail();
  if (email == null) {
    return null;
  }

  const recordFreezer = document.getElementById("recordFreezer").value;

  console.log(">>>>>>>", recordFreezer);
  even.preventDefault();
}
