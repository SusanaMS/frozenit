const _tr_ = document.createElement("tr"),
  _th_ = document.createElement("th"),
  _td_ = document.createElement("td");

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

// https://stackoverflow.com/questions/5180382/convert-json-data-to-a-html-table
function jsonArray2htmlTable(table, arr, buttonFunc) {
  const columns = addAllColumnHeaders(arr, table);
  let i = 0;
  let botonEliminar;
  for (; i < arr.length; ++i) {
    const tr = _tr_.cloneNode(false);
    let j = 0;
    for (; j < columns.length; ++j) {
      const td = _td_.cloneNode(false);
      const celda = arr[i][columns[j]] || "err";
      if (j === 0 && buttonFunc != null) {
        botonEliminar = document.createElement("button");
        botonEliminar.innerHTML = "Eliminar";
        botonEliminar.setAttribute("id", `${table.id}Delete-${celda}`);
        botonEliminar.onclick = buttonFunc;
        td.appendChild(botonEliminar);
      } else {
        td.appendChild(document.createTextNode(celda));
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  return table;
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
function addAllColumnHeaders(arr, table) {
  const columnSet = [],
    tr = _tr_.cloneNode(false);
  let i = 0,
    l = arr.length;
  for (; i < l; i++) {
    for (const key in arr[i]) {
      if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
        columnSet.push(key);
        const th = _th_.cloneNode(false);
        th.appendChild(document.createTextNode(key));
        tr.appendChild(th);
      }
    }
  }
  table.appendChild(tr);
  return columnSet;
}

function array2option(arrayValues, selectNode) {
  arrayValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    selectNode.appendChild(option);
  });
  return null;
}

function checkJWT(jwtToken) {
  if (jwtToken == null) {
    console.error("debe estar logeado");
    window.alert("Debe estar logeado");
    return false;
  }
  return true;
}

function getUserEmail() {
  const email = JSON.parse(localStorage.getItem("sessionUserInfo")).email;
  if (email == null) {
    console.error("No se puede obtener el mail de usuario");
    window.alert("Error al obtener el id de usuario");
  }
  return email;
}

export { apiError, jsonArray2htmlTable, array2option, checkJWT, getUserEmail };
