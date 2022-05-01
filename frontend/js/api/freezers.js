// doc
import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import { apiError, jsonArray2htmlTable } from "../common/utils.js";

const MODEL_ENPOINT = "freezers",
  jwtToken = localStorage.getItem("jwtToken"),
  freezerGet = document.getElementById("freezerGet"),
  freezerAdd = document.getElementById("freezerAdd"),
  freezerBoxAdd = document.getElementById("freezerBoxAdd"),
  freezerBox = document.getElementById("freezerBox"),
  freezerTable = document.getElementById("freezerTable"),
  freezerBoxMessage = document.getElementById("freezerBoxMessage"),
  freezerAddErrorMessage = document.getElementById("freezerAddErrorMessage"),
  addFreezerForm = document.getElementById("addFreezerForm");

let apiHeaders;

freezerGet.addEventListener("click", processFreezerGet);
freezerAdd.addEventListener("click", () => {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }
  freezerBoxAdd.setAttribute("style", "display: flex");
});
addFreezerForm.addEventListener("submit", processFreezerAdd);

function processFreezerGet() {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }
  new Promise((resolve) => {
    apiHeaders = new Headers();
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

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      freezerBox.setAttribute("style", "display: flex");
      const jsonResult = JSON.parse(result);
      console.debug(jsonResult);
      if (jsonResult != null && !jsonResult.error) {
        if (!jsonResult.length) {
          apiError(
            false,
            freezerBoxMessage,
            endpoint,
            "no hay frigorificos asociados a su cuenta"
          );
        } else {
          // eliminamos el contenido previo de la tabla
          freezerTable.innerHTML = "";

          jsonArray2htmlTable(freezerTable, jsonResult, deleteFreezer);
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

function deleteFreezer(elem) {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }
  if (elem.path == null) {
    alert("Error al obtener el id del freezer");
    return null;
  }

  let idAeliminar;

  try {
    idAeliminar = elem.path[0].id.split("-")[1];
  } catch (error) {
    alert("Error al obtener el id del freezer");
    return null;
  }

  console.log(`Eliminando id: ${idAeliminar}`);

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
        window.alert("Baja de frigorifico correcta");
        const sessionUserInfo = JSON.parse(
          localStorage.getItem("sessionUserInfo")
        );
        console.log(sessionUserInfo);
        if (sessionUserInfo.email != null) {
          console.log(sessionUserInfo.email);
          getFreezersByUser(sessionUserInfo.email);
        } else {
          location.reload();
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

function processFreezerAdd(event) {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }
  const freezerName = document.getElementById("freezerName").value;
  const freezerNotes = document.getElementById("freezerNotes").value;
  const email = JSON.parse(localStorage.getItem("sessionUserInfo")).email;
  if (email == null) {
    alert("Error al obtener el id de usuario");
    return null;
  }
  console.log(freezerNotes, freezerName);

  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const jsonRequest = JSON.stringify({
    name: freezerName,
    email: email,
    notes: freezerNotes,
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
      console.log(jsonResult);
      if (jsonResult.error == null) {
        window.alert("alta de congelador correcta!");
        getFreezersByUser(email);
      } else {
        apiError(false, freezerAddErrorMessage, endpoint, jsonResult.error);
      }
    })
    .catch((error) =>
      apiError(true, freezerAddErrorMessage, endpoint, error.message)
    );

  event.preventDefault();
}
