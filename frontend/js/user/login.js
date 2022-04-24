// doc
import { BASE_ENDPOINT } from "../app/constants.js";

const apiHeaders = new Headers();
apiHeaders.append("Content-Type", "application/json");

document.getElementById("loginForm").addEventListener("submit", processLogin);

function processLogin(event) {
  const emailLogin = document.getElementById("emailLogin").value;
  const paswordLogin = document.getElementById("passwordLogin").value;
  console.debug(`enviado formulario login: ${emailLogin} / ${paswordLogin}`);

  const jsonString = JSON.stringify({
    email: emailLogin,
    password: paswordLogin,
  });

  const requestOptions = {
    method: "POST",
    headers: apiHeaders,
    body: jsonString,
    redirect: "follow",
  };

  fetch(`${BASE_ENDPOINT}/users/login/`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      console.log(jsonResult);
      if (jsonResult.token != null) {
        console.log("Login correcto");
        localStorage.setItem("jwtToken", jsonResult.token);
      } else {
        console.error("Login incorrecto");
      }
    })
    .catch((error) => console.error("error en fetch", error));

  event.preventDefault();
}
