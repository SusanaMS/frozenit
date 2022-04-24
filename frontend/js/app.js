// doc

document.getElementById("loginForm").addEventListener("submit", processLogin);

function processLogin(event) {
  const emailLogin = document.getElementById("emailLogin").value;
  const paswordLogin = document.getElementById("passwordLogin").value;
  console.debug(`enviado formulario login: ${emailLogin} / ${paswordLogin}`);

  event.preventDefault();
}
