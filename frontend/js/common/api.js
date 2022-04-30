function apiError(isConnectError, errorDOM, endpoint, errorMessage) {
  const errorMessageAPI = `error API: ${endpoint} => ${errorMessage}`;
  console.error(errorMessageAPI);
  let alertErrorMessage;
  if (isConnectError) {
    alertErrorMessage = "error de conexión a la API";
  } else {
    alertErrorMessage = errorMessage;
  }
  alert(alertErrorMessage);
  errorDOM.classList.add("nothidden");
}

export { apiError };
