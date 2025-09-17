const inputTable = document.getElementById("input-table");
const resultTable = document.getElementById("result-table");
let nodeNum = 11;

(() => {
  const data = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  ];
  let twoWay = true;

  // Рисуем таблицы
  function drawTable(table, nodeNum, allDisabled = false) {
    const trh = document.createElement("tr");
    trh.appendChild(document.createElement("th"));

    for (let j = 0; j < nodeNum; j++) {
      const th = document.createElement("th");
      th.textContent = `X${j + 1}`;
      trh.appendChild(th);
    }
    table.appendChild(trh);

    for (let i = 0; i < nodeNum; i++) {
      const tr = document.createElement("tr");
      tr.appendChild(document.createElement("th")).textContent = `X${i + 1}`;

      for (let j = 0; j < nodeNum; j++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        if (allDisabled) {
          input.disabled = true;
          input.style.backgroundColor = "#f0f0f0";
          input.value = 0;
          input.className = "table-input";
        } else {
          input.className = "table-input read-table-value";
          if (i >= j && twoWay) {
            input.disabled = true;
            input.style.backgroundColor = "#f0f0f0";
          }
          if (i === j) {
            input.disabled = true;
            input.style.backgroundColor = "#f0f0f0";
            input.value = 0;
          } else {
            input.value = data[i][j];
          }
        }
        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  function drawTables() {
    inputTable.innerHTML = "";
    resultTable.innerHTML = "";
    drawTable(inputTable, nodeNum);
    drawTable(resultTable, nodeNum, true);
  }

  function updateTable(event) {
    const inputValue = event.target.valueAsNumber;
    if (isNaN(inputValue) || inputValue < 5 || inputValue > 11) {
      return;
    }
    nodeNum = inputValue;
    drawTables();
  }

  function clearTable(event) {
    const tableData = getTableData();
    let resmsg = "";
    for (let i = 0; i < nodeNum; i++) {
      for (let j = 0; j < nodeNum; j++) {
        resmsg += `${tableData[i][j]}  `;
      }
      resmsg += "\n";
    }
    console.log(resmsg);
  }

  drawTables();

  document.getElementById("num-nodes").addEventListener("input", updateTable);
  document.getElementById("clear-table").addEventListener("click", clearTable);
})();

export function getTableData() {
  const tableInputs = document.querySelectorAll(".read-table-value");
  const tableData = [];

  for (let i = 0; i < nodeNum; i++) {
    tableData[i] = [];
  }

  tableInputs.forEach((input, index) => {
    const row = Math.floor(index / nodeNum);
    const col = index % nodeNum;
    if (!tableData[row]) {
      tableData[row] = [];
    }
    tableData[row][col] = parseInt(input.value, 10) || 0;
  });

  return tableData;
}
