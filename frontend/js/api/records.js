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
          jsonArray2htmlTable(recordTable, jsonResult, [
            { func: unfreeze, name: "Descongelar" },
          ]);
        }
      } else {
        apiError(
          false,
          recordBoxMessage,
          endpoint,
          jsonResult != null
            ? jsonResult.error || "sin error definido"
            : "no se ha obtenido respuesta"
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
  console.debug(endpoint, requestOptions);
  const fecthFreezers = async () => {
    await fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const jsonResult = JSON.parse(result);
        if (jsonResult.error != null) {
          apiError(false, recordAddErrorMessage, endpoint, jsonResult.error);
        } else {
          let jsonObject = [];
          jsonResult.forEach((optSel) =>
            jsonObject.push({ id: optSel.id, value: optSel.freezer })
          );
          console.debug(jsonObject);
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

  const fecthFoods = async () => {
    await fetch(endpoint, requestOptions)
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

function processRecordAdd(event) {
  if (!checkJWT(jwtToken)) {
    return null;
  }

  const email = getUserEmail();
  if (email == null) {
    return null;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/selectedIndex
  const freezerId = parseInt(
    recordFreezer[recordFreezer.selectedIndex].id.split("-")[1]
  );

  const foodId = parseInt(
    recordFood[recordFood.selectedIndex].id.split("-")[1]
  );

  const addDate = recordFreezeDate.value;

  console.debug(
    `email: ${email} freezerdId: ${freezerId} foodId: ${foodId} addDate: ${addDate}`
  );

  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const jsonRequest = JSON.stringify({
    email: email,
    freezerId: freezerId,
    foodId: foodId,
    addDate: addDate,
  });

  const requestOptions = {
    method: "POST",
    headers: apiHeaders,
    body: jsonRequest,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/${MODEL_ENPOINT}/add/`;

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      console.debug(jsonResult);
      if (jsonResult.error == null) {
        const { fechaExpiracion } = jsonResult;
        window.alert(
          `Alimento congelado correctamente! Fecha de caducidad: ${fechaExpiracion}`
        );
        recordBoxAdd.setAttribute("style", "display: none");
        // inicializamos las options de las select
        recordFreezer.options.length = 0;
        recordFood.options.length = 0;
        processRecordGet(event);
      } else {
        apiError(false, recordAddErrorMessage, endpoint, jsonResult.error);
      }
    })
    .catch((error) =>
      apiError(true, recordAddErrorMessage, endpoint, error.message)
    );

  event.preventDefault();
}

function unfreeze(event) {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }

  if (event.path == null) {
    alert("Error al obtener el id del freezer");
    return null;
  }

  let idAeliminar;

  try {
    idAeliminar = event.path[0].id.split("-")[1];
  } catch (error) {
    alert("Error al obtener el id del freezer");
    return null;
  }

  console.log(`Descongelando id: ${idAeliminar}`);

  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const requestOptions = {
    method: "DELETE",
    headers: apiHeaders,
    body: "",
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/${MODEL_ENPOINT}/id/${idAeliminar}`;

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      console.log(jsonResult);
      if (jsonResult != null && !jsonResult.error) {
        window.alert("Descongelado de alimento correcto");
        processRecordGet(event);
      } else {
        apiError(
          false,
          recordBoxMessage,
          endpoint,
          jsonResult != null
            ? jsonResult.error || "sin error definido"
            : "no se ha obtenido respuesta"
        );
      }
    })
    .catch((error) =>
      apiError(true, recordBoxMessage, endpoint, "kkkkk" + error.message)
    );
  return null;
}
