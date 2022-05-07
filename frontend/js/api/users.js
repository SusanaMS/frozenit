// doc
import {
  BASE_ENDPOINT,
  API_CONTENT_TYPE,
  AVATAR_MAX_WIDTH,
  AVATAR_MAX_HEIGHT,
} from "../common/constants.js";
import { apiError, clearActions } from "../common/utils.js";

const MODEL_ENPOINT = "users";

const jwtToken = localStorage.getItem("jwtToken");
const sessionUserInfo = localStorage.getItem("sessionUserInfo");

const apiHeaders = new Headers();
apiHeaders.append("Content-Type", API_CONTENT_TYPE);

const logBox = document.getElementById("logBox"),
  loginForm = document.getElementById("loginForm"),
  userInfo = document.getElementById("userInfo"),
  avatarSignup = document.getElementById("avatarSignup"),
  avatarSignupPreview = document.getElementById("avatarSignupPreview"),
  logoutButton = document.getElementById("logoutButton"),
  signupButton = document.getElementById("signupButton"),
  signupForm = document.getElementById("signupForm");

loginForm.addEventListener("submit", processLogin);
signupForm.addEventListener("submit", processSignup);
avatarSignup.addEventListener("change", processAvatar);

logoutButton.addEventListener("click", logout);
signupButton.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupButton.classList.add("hidden");
  signupForm.classList.add("nothidden");
});

if (jwtToken != null) {
  // cuando tenemos almacenad el jwt existía un login previo
  clearActions();
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
  const signupAvatar = avatarSignupPreview.src || "";

  signupErrorMessage.classList.add("hidden");

  const jsonRequest = JSON.stringify({
    username: usernameSignup,
    email: emailSignup,
    password: passwordSignup,
    validation_password: passwordSignupConfirmation,
    avatar: signupAvatar,
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

function processAvatar(event) {
  const avatarFile = event.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(avatarFile);

  reader.onloadend = function () {
    avatarSignupPreview.src = reader.result;
  };

  avatarSignupPreview.onload = (event) => {
    const avatarWidth = event.target.width;
    const avatarHeight = event.target.height;

    console.log(`avatar anchura: ${avatarWidth} altura: ${avatarHeight}`);

    if (avatarWidth > AVATAR_MAX_WIDTH || avatarHeight > AVATAR_MAX_HEIGHT) {
      alert(
        `El avatar es demasiado grande. Anchura: ${avatarWidth}/${AVATAR_MAX_WIDTH} Altura: ${avatarHeight}/${AVATAR_MAX_HEIGHT}`
      );
      avatarSignupPreview.src = "";
    }
  };

  event.preventDefault();
}

function logout(event) {
  console.log("logout");
  localStorage.clear();
  location.reload();
  event.preventDefault();
}
