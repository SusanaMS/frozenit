// doc
import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";

const MODEL_ENPOINT = "freezers";
const jwtToken = localStorage.getItem("jwtToken");
const freezerGroup = document.getElementById("freezerGroup");
const apiHeaders = new Headers();

if (jwtToken == null) {
  console.log("no token!!!");
} else {
  // usamos una promise patra asegurarnos del orden sincronizado de ejecución
  new Promise((resolve) => {
    apiHeaders.append("Content-Type", API_CONTENT_TYPE);
    apiHeaders.append("Authorization", `Bearer ${jwtToken}`);
    freezerGroup.classList.add("nothidden");
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

  console.log(endpoint);

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  return null;
}
