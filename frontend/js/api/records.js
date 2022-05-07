import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import {
  apiError,
  jsonArray2htmlTable,
  json2option,
  checkJWT,
  getUserEmail,
  clearActions,
} from "../common/utils.js";

const MODEL_ENPOINT = "records",
  jwtToken = localStorage.getItem("jwtToken"),
  recordGet = document.getElementById("recordGet"),
  recordBox = document.getElementById("recordBox"),
  recordTable = document.getElementById("recordTable"),
  logBox = document.getElementById("logBox"),
  recordBoxMessage = document.getElementById("recordBoxMessage"),
  recordAdd = document.getElementById("recordAdd"),
  recordBoxAdd = document.getElementById("recordBoxAdd"),
  recordFreezer = document.getElementById("recordFreezer"),
  recordFood = document.getElementById("recordFood"),
  recordSlot = document.getElementById("recordSlot"),
  recordFreezeDate = document.getElementById("recordFreezeDate"),
  recordAddErrorMessage = document.getElementById("recordAddErrorMessage"),
  addRecordForm = document.getElementById("addRecordForm"),
  alertGet = document.getElementById("alertGet"),
  alertTable = document.getElementById("alertTable");

let apiHeaders;

recordGet.addEventListener("click", processRecordGet);
recordAdd.addEventListener("click", clickRecordAdd);
addRecordForm.addEventListener("submit", processRecordAdd);
recordFreezer.addEventListener("change", onSelectMax);
alertGet.addEventListener("click", processAlertGet);

function processRecordGet(event) {
  clearActions().then((result) => {
    if (!checkJWT(jwtToken)) {
      logBox.style = "display: block";
      return null;
    }
  });

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
            "No hay alimentos congelados"
          );
        } else {
          recordTable.innerHTML = "";
          jsonArray2htmlTable(
            recordTable,
            jsonResult,
            [{ func: unfreeze, name: "Descongelar" }],
            ["alerta"]
          );
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
  recordFreezer.options.length = 0;

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

  let jsonResult;

  // https://stackoverflow.com/questions/59650572/how-to-wait-for-response-of-fetch-in-async-function
  console.debug(endpoint, requestOptions);
  const fecthFreezers = async () => {
    await fetch(endpoint, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        jsonResult = JSON.parse(result);
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

  return jsonResult;
}

async function recordFoodSelect() {
  recordFood.options.length = 0;

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
  clearActions().then((result) => {
    if (!checkJWT(jwtToken)) {
      logBox.style = "display: block";
      return null;
    }
  });

  const email = getUserEmail();
  if (email == null) {
    return null;
  }

  recordFreezeDate.valueOf().value = new Date().toISOString().slice(0, 10);

  // con la combianción async / await / Promise.all podemos lanzar las fecth
  // de forma simultanea pero esperamos a que todas se completen para mostrar
  // el formulario con las option ya metidas en las select
  Promise.all([recordFreezerSelect(email), recordFoodSelect()]).then((res) => {
    localStorage.setItem("freezers", JSON.stringify(res[0]));
    if (onSelectMax()) {
      recordBoxAdd.setAttribute("style", "display: flex");
    } else {
      alert("No dispone de congeladores!!");
    }
  });

  event.preventDefault();
}

function onSelectMax() {
  console.debug("onSelectMax");
  const freezers = JSON.parse(localStorage.getItem("freezers"));
  console.debug(freezers);

  // https://stackoverflow.com/questions/13964155/get-javascript-object-from-array-of-objects-by-value-of-property
  // necesitamos que el max num de slots cuadre con lo seleccionado
  const sel = freezers.find((obj) => {
    return obj.freezer === recordFreezer[recordFreezer.selectedIndex].value;
  });
  let maxSlots = 0;
  if (sel != null) {
    maxSlots = sel.slots != null ? sel.slots : 5;
  } else {
    return false;
  }

  recordSlot.setAttribute("max", maxSlots);
  return true;
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
      if (jsonResult != null && !jsonResult.error) {
        window.alert("Alimento descongelado correctamente");
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

function processAlertGet(event) {
  clearActions().then((result) => {
    if (!checkJWT(jwtToken)) {
      logBox.style = "display: block";
      return null;
    }
  });

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
            "no existen alertas asociadas a su cuenta"
          );
        } else {
          recordTable.innerHTML = "";

          // filtarmos el array que nos retorna la API para excluir las alertas de
          // level NORMAL
          const alerts = jsonResult.filter((rec) => rec.alerta != "NORMAL");

          if (alerts.length) {
            jsonArray2htmlTable(recordTable, alerts, null, [
              "slot",
              "caduca",
              "congelado",
            ]);
          } else {
            // TODO: Cambiar el tipo de mensaje ?
            apiError(
              false,
              recordBoxMessage,
              endpoint,
              "No hay alimentos próximos a su fecha de caducidad"
            );
          }
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
