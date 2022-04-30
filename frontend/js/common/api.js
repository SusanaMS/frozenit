function apiError(errorDOM, endpoint, errorMessage) {
  const errorMessageAPI = `error API: ${endpoint} => ${errorMessage}`;
  console.error(errorMessageAPI);
  errorDOM.innerText = "error de conexión a la API";
  errorDOM.classList.add("nothidden");
}

export { apiError };
