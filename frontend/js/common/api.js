const _table_ = document.createElement("table"),
  _tr_ = document.createElement("tr"),
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
// Builds the HTML Table out of myList json data from Ivy restful service.
function jsonArray2htmlTable(arr, domId) {
  const table = _table_.cloneNode(false),
    columns = addAllColumnHeaders(arr, table);
  let i = 0,
    maxi = arr.length;
  for (; i < maxi; ++i) {
    const tr = _tr_.cloneNode(false);
    let j = 0,
      maxj = columns.length;
    for (; j < maxj; ++j) {
      const td = _td_.cloneNode(false);
      td.appendChild(document.createTextNode(arr[i][columns[j]] || ""));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  table.setAttribute("id", domId);
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

export { apiError, jsonArray2htmlTable };
