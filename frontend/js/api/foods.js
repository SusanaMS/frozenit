import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import {
  apiError,
  jsonArray2htmlTable,
  array2option,
  clearBoxes,
} from "../common/utils.js";

const MODEL_ENPOINT = "foods",
  jwtToken = localStorage.getItem("jwtToken"),
  foodGet = document.getElementById("foodGet"),
  foodCategories = document.getElementById("foodCategories"),
  foodAdd = document.getElementById("foodAdd"),
  foodBoxAdd = document.getElementById("foodBoxAdd"),
  foodBox = document.getElementById("foodBox"),
  foodTable = document.getElementById("foodTable"),
  foodBoxMessage = document.getElementById("foodBoxMessage"),
  foodAddErrorMessage = document.getElementById("foodAddErrorMessage"),
  addFoodForm = document.getElementById("addFoodForm");

let apiHeaders;

foodGet.addEventListener("click", processFoodGet);
foodAdd.addEventListener("click", clickFoodAdd);
addFoodForm.addEventListener("submit", processFoodAdd);

function processFoodGet(event) {
  clearBoxes();
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
          foodTable.innerHTML = "";
          jsonArray2htmlTable(foodTable, jsonResult, null);
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
  clearBoxes();

  foodCategories.options.length = 0;

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
        console.log(jsonResult);
        // https://stackoverflow.com/questions/33872615/are-es6-array-comprehensions-no-longer-valid/33873355#33873355
        const categories = jsonResult.map(({ name_category }) => name_category);
        array2option(categories, foodCategories);
        foodBoxAdd.setAttribute("style", "display: flex");
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
  const foodCategory = foodCategories.valueOf().value;

  console.log(foodName, foodNotes, foodCategory);

  apiHeaders = new Headers();
  apiHeaders.append("Content-Type", API_CONTENT_TYPE);
  apiHeaders.append("Authorization", `Bearer ${jwtToken}`);

  const jsonRequest = JSON.stringify({
    name: foodName,
    category: foodCategory,
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
