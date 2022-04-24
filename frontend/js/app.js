// doc
const apiHeaders = new Headers();
apiHeaders.append("Content-Type", "application/json");

document.getElementById("loginForm").addEventListener("submit", processLogin);

function processLogin(event) {
  const emailLogin = document.getElementById("emailLogin").value;
  const paswordLogin = document.getElementById("passwordLogin").value;
  console.debug(`enviado formulario login: ${emailLogin} / ${paswordLogin}`);

  const raw = JSON.stringify({
    email: emailLogin,
    password: paswordLogin,
  });

  const requestOptions = {
    method: "POST",
    headers: apiHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:3000/api/v1/users/login/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error("error", error));

  event.preventDefault();
}
