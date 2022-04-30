// doc
import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import { apiError, jsonArray2htmlTable } from "../common/api.js";

const MODEL_ENPOINT = "freezers";
const jwtToken = localStorage.getItem("jwtToken");
const freezerGet = document.getElementById("freezerGet");
const freezerBox = document.getElementById("freezerBox");
const freezerBoxMessage = document.getElementById("freezerBoxMessage");

let apiHeaders;

freezerGet.addEventListener("click", processFreezerGet);

function processFreezerGet() {
  if (jwtToken == null) {
    console.error("debe estar logeado");
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
          const element = document.getElementById("freezerTable");
          if (element != null) {
            element.remove();
          }

          const htmlTable = jsonArray2htmlTable(
            jsonResult,
            "freezerTable",
            deleteFreezer
          );
          console.log(htmlTable);
          freezerBox.appendChild(htmlTable);
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
      console.log(result);
      const jsonResult = JSON.parse(result);
      console.log(jsonResult);
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
    })
    .catch((error) =>
      apiError(true, freezerBoxMessage, endpoint, error.message)
    );
  return null;
}
