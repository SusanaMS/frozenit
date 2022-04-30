// doc
import { BASE_ENDPOINT, API_CONTENT_TYPE } from "../common/constants.js";
import { apiError } from "../common/utils.js";

const MODEL_ENPOINT = "users";

const jwtToken = localStorage.getItem("jwtToken");
const sessionUserInfo = localStorage.getItem("sessionUserInfo");

const apiHeaders = new Headers();
apiHeaders.append("Content-Type", API_CONTENT_TYPE);

const logBox = document.getElementById("logBox");
const loginForm = document.getElementById("loginForm");
const userInfo = document.getElementById("userInfo");
const logoutButton = document.getElementById("logoutButton");
const signupButton = document.getElementById("signupButton");
const signupForm = document.getElementById("signupForm");

loginForm.addEventListener("submit", processLogin);
signupForm.addEventListener("submit", processSignup);

logoutButton.addEventListener("click", logout);
signupButton.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupButton.classList.add("hidden");
  signupForm.classList.add("nothidden");
});

if (jwtToken != null) {
  // cuando tenemos almacenad el jwt existía un login previo
  logBox.setAttribute("style", "display: none");
  signupButton.classList.add("hidden");
  userInfo.innerText = JSON.parse(sessionUserInfo).username;
} else {
  // si no es así mostramos el formulario de login
  logBox.setAttribute("style", "display: flex");
}

function processLogin(event) {
  const emailLogin = document.getElementById("emailLogin").value;
  const paswordLogin = document.getElementById("passwordLogin").value;
  const loginErrorMessage = document.getElementById("loginErrorMessage");

  console.debug(`enviado formulario login: ${emailLogin} / ${paswordLogin}`);

  loginErrorMessage.classList.add("hidden");

  const jsonRequest = JSON.stringify({
    email: emailLogin,
    password: paswordLogin,
  });

  const requestOptions = {
    method: "POST",
    headers: apiHeaders,
    body: jsonRequest,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/${MODEL_ENPOINT}/login/`;

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      console.log(jsonResult);
      if (jsonResult.token != null) {
        console.log("Login correcto");
        //almecanemos el token jwt y la info de usuario
        localStorage.setItem("jwtToken", jsonResult.token);
        localStorage.setItem("sessionUserInfo", JSON.stringify(jsonResult));
        signupButton.classList.add("hidden");
        location.reload();
      } else {
        apiError(false, loginErrorMessage, endpoint, jsonResult.error);
      }
    })
    .catch((error) =>
      apiError(true, loginErrorMessage, endpoint, error.message)
    );

  event.preventDefault();
}

function processSignup(event) {
  console.log("signup");

  const usernameSignup = document.getElementById("usernameSignup").value;
  const emailSignup = document.getElementById("emailSignup").value;
  const passwordSignup = document.getElementById("passwordSignup").value;
  const passwordSignupConfirmation = document.getElementById(
    "passwordSignupConfirmation"
  ).value;
  const signupErrorMessage = document.getElementById("signupErrorMessage");

  signupErrorMessage.classList.add("hidden");

  const jsonRequest = JSON.stringify({
    username: usernameSignup,
    email: emailSignup,
    password: passwordSignup,
    validation_password: passwordSignupConfirmation,
  });

  const requestOptions = {
    method: "POST",
    headers: apiHeaders,
    body: jsonRequest,
    redirect: "follow",
  };

  const endpoint = `${BASE_ENDPOINT}/${MODEL_ENPOINT}/signup/`;

  fetch(endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      console.log(jsonResult);
      if (jsonResult.error == null) {
        console.log("Signup correcto");
        window.alert("Signup correcto! Puedes logearte con tus credenciales");
        location.reload();
      } else {
        apiError(false, signupErrorMessage, endpoint, jsonResult.error);
      }
    })
    .catch((error) =>
      apiError(true, signupErrorMessage, endpoint, error.message)
    );

  event.preventDefault();
}

function logout(event) {
  console.log("logout");
  event.preventDefault();
  localStorage.clear();
  location.reload();
}
