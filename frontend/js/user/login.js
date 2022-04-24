// doc
import { BASE_ENDPOINT } from "../app/constants.js";

const jwtToken = localStorage.getItem("jwtToken");

const apiHeaders = new Headers();
apiHeaders.append("Content-Type", "application/json");

const loginForm = document.getElementById("loginForm");
const userStatus = document.getElementById("userStatus");
const logoutButton = document.getElementById("logoutButton");

if (jwtToken != null) {
  loginForm.classList.add("hidden");
} else {
  userStatus.classList.add("hidden");
}

loginForm.addEventListener("submit", processLogin);
logoutButton.addEventListener("click", logout);

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
        //almecanemos el token en la sesión web
        localStorage.setItem("jwtToken", jsonResult.token);
        localStorage.setItem("userInfo", jsonResult);
        loginForm.classList.toggle("hidden");
        userStatus.classList.toggle("hidden");
        userInfo.innerText = jsonResult.username;
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
