import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import { apiError, jsonArray2htmlTable } from "../common/utils.js";

const MODEL_ENPOINT = "foods";
const jwtToken = localStorage.getItem("jwtToken");
const foodGet = document.getElementById("foodGet");
const foodCategories = document.getElementById("foodCategories");
const foodAdd = document.getElementById("foodAdd");
const foodBoxAdd = document.getElementById("foodBoxAdd");
const foodBox = document.getElementById("foodBox");
const foodBoxMessage = document.getElementById("foodBoxMessage");
const foodAddErrorMessage = document.getElementById("foodAddErrorMessage");
const addFoodForm = document.getElementById("addFoodForm");

let apiHeaders;

foodGet.addEventListener("click", processFoodGet);
foodAdd.addEventListener("click", clickFoodAdd);
addFoodForm.addEventListener("submit", processFoodAdd);

function processFoodGet(event) {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }
  apiHeaders = new Headers();
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const requestOptions = {
    method: "GET",
    headers: apiHeaders,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/${MODEL_ENPOINT}/all`;

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      foodBox.setAttribute("style", "display: flex");
      const jsonResult = JSON.parse(result);
      console.debug(jsonResult);
      if (jsonResult != null && !jsonResult.error) {
        if (!jsonResult.length) {
          apiError(
            false,
            foodBoxMessage,
            endpoint,
            "no hay frigorificos asociados a su cuenta"
          );
        } else {
          const element = document.getElementById("foodTable");
          if (element != null) {
            element.remove();
          }

          const htmlTable = jsonArray2htmlTable(jsonResult, "foodTable", null);
          console.log(htmlTable);
          foodBox.appendChild(htmlTable);
        }
      } else {
        apiError(
          false,
          foodBoxMessage,
          endpoint,
          jsonResult.error || "no se ha obtenido respuesta"
        );
      }
    })
    .catch((error) => apiError(true, foodBoxMessage, endpoint, error.message));

  event.preventDefault();
}

function clickFoodAdd(event) {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }

  apiHeaders = new Headers();
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const requestOptions = {
    method: "GET",
    headers: apiHeaders,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/categories/all`;

  console.log(endpoint, requestOptions);
  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      if (jsonResult.error != null) {
        apiError(false, foodAddErrorMessage, endpoint, jsonResult.error);
      } else {
        foodBoxAdd.setAttribute("style", "display: flex");
        console.log(jsonResult);
      }
    })
    .catch((error) => {
      apiError(true, foodAddErrorMessage, endpoint, error.message);
    });

  event.preventDefault();
}

function processFoodAdd(event) {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return;
  }

  const foodName = document.getElementById("foodName").value;
  const foodNotes = document.getElementById("foodNotes").value;

  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const jsonRequest = JSON.stringify({
    name: foodName,
    category: "Verduras",
    remarks: foodNotes,
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
        window.alert("alta de alimento correcta!");
        processFoodGet(event);
      } else {
        apiError(false, foodAddErrorMessage, endpoint, jsonResult.error);
      }
    })
    .catch((error) =>
      apiError(true, foodAddErrorMessage, endpoint, error.message)
    );

  event.preventDefault();
}
