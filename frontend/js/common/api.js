function apiError(isConnectError, errorDOM, endpoint, errorMessage) {
  const errorMessageAPI = `error API: ${endpoint} => ${errorMessage}`;
  console.error(errorMessageAPI);
  if (isConnectError) {
    errorDOM.innerText = "error de conexión a la API";
  } else {
    errorDOM.innerText = errorMessage;
  }
  errorDOM.classList.add("nothidden");
}

export { apiError };
