export const inputTable = document.getElementById("input-table");
const resultTable = document.getElementById("result-table");
let tableSize = 11;
let twoWay = true;

export function drawTable(table, tableSize, data, isResultTable = false) {
  // Создание заголовка столбца
  const trh = document.createElement("tr");
  trh.appendChild(document.createElement("th"));

  // Добавление заголовков столбцов
  for (let j = 0; j < tableSize; j++) {
    const th = document.createElement("th");
    th.textContent = `X${j + 1}`;
    trh.appendChild(th);
  }
  table.appendChild(trh);

  // Создание строк таблицы
  for (let i = 0; i < tableSize; i++) {
    const tr = document.createElement("tr");

    // Добавление заголовка строки
    tr.appendChild(document.createElement("th")).textContent = `X${i + 1}`;

    for (let j = 0; j < tableSize; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");

      input.type = "text";
      if (isResultTable) {
        input.disabled = true;
        input.value = (data[i] && data[i][j]) || 0;
        input.className = "table-input";
      } else {
        input.className = "table-input read-table-value";
        if (i >= j && twoWay) {
          input.disabled = true;
        }
        if (i === j) {
          input.disabled = true;
          input.value = 0;
        } else {
          input.value = (data[i] && data[i][j]) || 0;
        }
      }
      td.appendChild(input);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  udpateTableColorScheme();
}

export function udpateTableColorScheme() {
  const tableInputs = document.querySelectorAll(".table-input");
  tableInputs.forEach((el) => {
    if (el.value === "1") {
      el.style.backgroundColor = "oklch(88.2% 0.059 254.128)";
    } else if (el.disabled) {
      el.style.backgroundColor = "#f0f0f0";
    } else {
      el.style.backgroundColor = "#fff";
    }
  });
}

export function setupTables(dummyData) {
  inputTable.innerHTML = "";
  resultTable.innerHTML = "";
  drawTable(inputTable, tableSize, dummyData);
  drawTable(resultTable, tableSize, dummyData, true);
}

export function redrawTables() {
  const currentData = getTableData();
  inputTable.innerHTML = "";
  resultTable.innerHTML = "";
  drawTable(inputTable, tableSize, currentData);
  drawTable(resultTable, tableSize, currentData, true);
}

export function updateTableSize(size) {
  tableSize = size;
  redrawTables();
}

export function clearTable() {
  const tableInputs = document.querySelectorAll(".table-input");
  tableInputs.forEach((input) => {
    input.value = 0;
  });
  udpateTableColorScheme();
}

export function getTableData() {
  const tableInputs = document.querySelectorAll(".read-table-value");
  const tableData = [];

  for (let i = 0; i < tableSize; i++) {
    tableData[i] = [];
  }

  tableInputs.forEach((input, index) => {
    const row = Math.floor(index / tableSize);
    const col = index % tableSize;
    if (!tableData[row]) {
      tableData[row] = [];
    }
    tableData[row][col] = parseInt(input.value, 10) || 0;
  });

  return tableData;
}

// Функция для обновления таблицы, если включен режим двухсторонней связи
export function updateTableIfTwoWay() {
  if (!twoWay) return;
  const tableInputs = document.querySelectorAll(".read-table-value");
  tableInputs.forEach((input, index) => {
    const row = Math.floor(index / tableSize);
    const col = index % tableSize;
    if (row > col) {
      const symmetricIndex = col * tableSize + row;
      const symmetricInput = tableInputs[symmetricIndex];
      input.value = symmetricInput.value;
    }
  });
}

export function toggleTwoWay() {
  twoWay = !twoWay;
  redrawTables();
}

export function checkEditedValue() {
  const tableInputs = document.querySelectorAll(".read-table-value");
  tableInputs.forEach((input) => {
    const value = input.value.trim();
    if (value.includes("1")) {
      input.value = 1;
    } else if (value === "" || value.includes("00")) {
      input.value = 0;
    } else {
      input.value = 0;
    }
  });
}
