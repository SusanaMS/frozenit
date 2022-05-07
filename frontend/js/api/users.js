// doc
import {
  BASE_ENDPOINT,
  API_CONTENT_TYPE,
  AVATAR_MAX_WIDTH,
  AVATAR_MAX_HEIGHT,
  AVATAR_DEFAULT_IMG,
} from "../common/constants.js";
import { apiError, clearActions } from "../common/utils.js";

const MODEL_ENPOINT = "users";

const jwtToken = localStorage.getItem("jwtToken");
const sessionUserInfo = localStorage.getItem("sessionUserInfo");

const apiHeaders = new Headers();
apiHeaders.append("Content-Type", API_CONTENT_TYPE);

const logBox = document.getElementById("logBox"),
  userAvatar = document.getElementById("userAvatar"),
  startBox = document.getElementById("startBox"),
  loginForm = document.getElementById("loginForm"),
  userInfo = document.getElementById("userInfo"),
  avatarSignup = document.getElementById("avatarSignup"),
  avatarSignupPreview = document.getElementById("avatarSignupPreview"),
  avatarImg = document.getElementById("avatarImg"),
  logoutButton = document.getElementById("logoutButton"),
  signupButton = document.getElementById("signupButton"),
  signinButton = document.getElementById("signinButton"),
  signupForm = document.getElementById("signupForm");

loginForm.addEventListener("submit", processLogin);
signupForm.addEventListener("submit", processSignup);
avatarSignup.addEventListener("change", processAvatar);

logoutButton.addEventListener("click", logout);

signinButton.addEventListener("click", () => {
  loginForm.hidden = false;
  signinButton.hidden = true;
  signupButton.hidden = false;
  signupForm.hidden = true;
  logoutButton.hidden = true;
});

signupButton.addEventListener("click", () => {
  loginForm.hidden = true;
  signinButton.hidden = false;
  signupButton.hidden = true;
  signupForm.hidden = false;
  logoutButton.hidden = true;
});

if (jwtToken != null) {
  // cuando tenemos almacenar el jwt existía un login previo
  userAvatar.hidden = false;
  signupButton.hidden = true;

  userInfo.innerText = JSON.parse(sessionUserInfo).username;
  avatarImg.src = JSON.parse(sessionUserInfo).avatar || AVATAR_DEFAULT_IMG;

  logBox.hidden = true;
  startBox.hidden = false;
  logoutButton.hidden = false;
} else {
  // si no es así mostramos el formulario de login
  logBox.style = "display: block";
  startBox.hidden = true;
  logoutButton.hidden = true;
  signupButton.hidden = false;
}

function processLogin(event) {
  const emailLogin = document.getElementById("emailLogin").value;
  const paswordLogin = document.getElementById("passwordLogin").value;
  const loginErrorMessage = document.getElementById("loginErrorMessage");

  console.debug(`enviado formulario login: ${emailLogin} / ${paswordLogin}`);

  loginErrorMessage.hidden = true;

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
        alert(`Login correcto. Bienvenido/a ${jsonResult.username}`);
        //almecanemos el token jwt y la info de usuario
        localStorage.setItem("jwtToken", jsonResult.token);
        localStorage.setItem("sessionUserInfo", JSON.stringify(jsonResult));
        signupButton.hidden = true;
        logoutButton.hidden = false;
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

  signupErrorMessage.hidden = true;

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
        alert("Registro correcto! Ya puedes logearte con tus credenciales");
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
        `El avatar es demasiado grande. Ancho: ${avatarWidth}/${AVATAR_MAX_WIDTH} Altura: ${avatarHeight}/${AVATAR_MAX_HEIGHT}`
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
  signinButton.hidden = false;
  event.preventDefault();
}
