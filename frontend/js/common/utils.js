const _tr_ = document.createElement("tr"),
  _th_ = document.createElement("th"),
  _td_ = document.createElement("td");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
function jsonArray2htmlTable(
  table,
  jsonArray,
  buttonFuncArray = null,
  skipCols = []
) {
  const jsonTable = [];

  jsonArray.forEach((json) => {
    console.log(json);
    skipCols.forEach((col) => delete json[col]);
    jsonTable.push(json);
  });

  console.debug(jsonTable);

  const columns = addAllColumnHeaders(jsonTable, table);

  let idColumnIndex = -1,
    numberOfButtons = 0;
  if (buttonFuncArray != null) {
    // determinamos la posicion del campo id en las columnas si existiera
    idColumnIndex = columns.map((col) => col.toLowerCase()).indexOf("id");
    numberOfButtons = buttonFuncArray.length;
  }

  console.debug(columns, idColumnIndex);

  let i = 0;
  for (; i < jsonTable.length; ++i) {
    const tr = _tr_.cloneNode(false);
    let j = 0;
    let idCelda = null;
    // con esta variable extraemos el boton correspondiente del array
    let buttonCont = 0;
    for (; j < columns.length + numberOfButtons; ++j) {
      const td = _td_.cloneNode(false);
      if (j < columns.length) {
        const celda = jsonTable[i][columns[j]] || "-";
        // si la columan tratada corresponde a donde está posicionada la ID
        // guardamos la id para setearla al boton/es
        idCelda = idCelda == null && j === idColumnIndex ? celda : idCelda;
        td.appendChild(document.createTextNode(celda));
      } else if (buttonFuncArray != null && idColumnIndex >= 0) {
        // en caso de sobrepasemos la longitud de columnas tendremos que añadir los
        // buttons como celdas adicionales
        const buttonData = buttonFuncArray[buttonCont];
        const button = document.createElement("button");
        button.innerHTML = buttonData.name;
        button.setAttribute("id", `${table.id}${buttonData.name}-${idCelda}`);
        button.onclick = buttonData.func;
        td.appendChild(button);
        buttonCont++;
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
        th.appendChild(document.createTextNode(capitalizeFirstLetter(key)));
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

function json2option(jsonData, selectNode) {
  jsonData.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.innerHTML = opt.value;
    option.id = `${opt.value}-${opt.id}`;
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

export {
  apiError,
  jsonArray2htmlTable,
  array2option,
  json2option,
  checkJWT,
  getUserEmail,
};
