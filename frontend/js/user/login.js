// doc
import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../app/constants.js";

const jwtToken = localStorage.getItem("jwtToken");
const sessionUserInfo = localStorage.getItem("sessionUserInfo");

const apiHeaders = new Headers();
apiHeaders.append("Content-Type", API_CONTENT_TYPE);

const loginForm = document.getElementById("loginForm");
const userStatus = document.getElementById("userStatus");
const userInfo = document.getElementById("userInfo");
const logoutButton = document.getElementById("logoutButton");

loginForm.addEventListener("submit", processLogin);
logoutButton.addEventListener("click", logout);

if (jwtToken != null) {
  // cuando tenemos almacenad el jwt existía un login previo
  loginForm.classList.add("hidden");
  userStatus.classList.add("nothidden");
  userInfo.innerText = JSON.parse(sessionUserInfo).username;
} else {
  // si no es así mostramos el formulario de login
  userStatus.classList.add("hidden");
  loginForm.classList.add("nothidden");
}

function processLogin(event) {
  const emailLogin = document.getElementById("emailLogin").value;
  const paswordLogin = document.getElementById("passwordLogin").value;
  const loginErrorMessage = document.getElementById("loginErrorMessage");

  console.debug(`enviado formulario login: ${emailLogin} / ${paswordLogin}`);

  loginErrorMessage.classList.add("hidden");

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
        //almecanemos el token jwt y la info de usuario
        localStorage.setItem("jwtToken", jsonResult.token);
        localStorage.setItem("sessionUserInfo", JSON.stringify(jsonResult));
        location.reload();
      } else {
        console.error("Login incorrecto");
        loginErrorMessage.innerText = jsonResult.error;
        loginErrorMessage.classList.add("nothidden");
      }
    })
    .catch((error) => console.error("error en fetch", error));

  event.preventDefault();
}

function logout(event) {
  console.log("logout");
  event.preventDefault();
  localStorage.clear();
  location.reload();
}
