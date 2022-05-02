import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import {
  apiError,
  jsonArray2htmlTable,
  json2option,
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
          let jsonObject = [];
          jsonResult.forEach((opt) =>
            jsonObject.push({ id: opt.id, value: opt.name_freezer })
          );
          json2option(jsonObject, recordFreezer);
        }
      })
      .catch((error) => {
        apiError(true, recordAddErrorMessage, endpoint, error.message);
      });
  };

  await fecthFreezers();
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

  const fecthFoods = async (args) => {
    const res = await fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const jsonResult = JSON.parse(result);
        if (jsonResult.error != null) {
          apiError(false, recordAddErrorMessage, endpoint, jsonResult.error);
        } else {
          let jsonObject = [];
          jsonResult.forEach((opt) => {
            jsonObject.push({ id: opt.id, value: opt.name_food });
          });
          json2option(jsonObject, recordFood);
        }
      })
      .catch((error) => {
        apiError(true, recordAddErrorMessage, endpoint, error.message);
      });
  };
  await fecthFoods();
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

  // con la combianción async / await / Promise.all podemos lanzar las fecth
  // de forma simultanea pero esperamos a que todas se completen para mostrar
  // el formulario con las option ya metidas en las select
  Promise.all([recordFreezerSelect(email), recordFoodSelect()]).then(() => {
    recordBoxAdd.setAttribute("style", "display: flex");
  });

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

  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedIndex
  const freezerId = recordFreezer[recordFreezer.selectedIndex].id.split("-")[1];
  const foodId = recordFood[recordFood.selectedIndex].id.split("-")[1];

  even.preventDefault();
}
