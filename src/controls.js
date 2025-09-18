import { drawForceGraph } from "./graph.js";
import {
  nextStep,
  stepBack,
  setupTables,
  getTableData,
  inputTable,
  clearTable,
  updateTableSize,
  updateTableIfTwoWay,
  checkEditedValue,
  udpateTableColorScheme,
} from "./interactive-table.js";

(() => {
  const pageContainer = document.querySelector(".page-container");
  const initialIcon = document.querySelector(".initial-icon");
  const hiddenIcon = document.querySelector(".hidden-icon");
  const tableSizeSelector = document.getElementById("num-nodes");
  const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
  const clearTableBtn = document.getElementById("clear-table");
  const nextStepBtn = document.getElementById("next-step-btn");
  const stepBackBtn = document.getElementById("step-back-btn");

  const dummyData = [
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  ];
  // Построение графа по умолчанию
  setupTables(dummyData);
  const tableData = getTableData();
  drawForceGraph(tableData);

  // Обработчик нажатия на кнопку
  toggleSidebarBtn.addEventListener("click", () => {
    pageContainer.classList.toggle("is-open");
    initialIcon.classList.toggle("hidden-icon");
    hiddenIcon.classList.toggle("hidden-icon");
  });
  // Обновление графа при изменении таблицы
  inputTable.addEventListener("input", () => {
    checkEditedValue();
    updateTableIfTwoWay();
    const updatedData = getTableData();
    drawForceGraph(updatedData);
    udpateTableColorScheme();
  });
  // Передвижение курсора по таблице с помощью клавиш стрелок
  inputTable.addEventListener("keydown", (event) => {
    const { key, target } = event;
    if (!target.classList.contains("editable")) return;

    const index = Array.from(
      inputTable.querySelectorAll(".editable")
    ).indexOf(target);
    const row = Math.floor(index / inputTable.rows.length);
    const col = index % inputTable.rows.length;
    let newRow = row;
    let newCol = col;

    switch (key) {
      case "ArrowUp":
        newRow = (row - 1 + inputTable.rows.length) % inputTable.rows.length;
        newCol = col + 1;
        break;
      case "ArrowDown":
        newRow = (row + 1) % inputTable.rows.length;
        newCol = col - 1;
        break;
      case "ArrowLeft":
        newCol = (col - 1 + inputTable.rows.length) % inputTable.rows.length;
        break;
      case "ArrowRight":
        newCol = (col + 1) % inputTable.rows.length;
        break;
      default:
        return; // Игнорируем другие клавиши
    }

    const newIndex = newRow * inputTable.rows.length + newCol;
    const newInput = inputTable.querySelectorAll(".editable")[newIndex];
    if (newInput) {
      newInput.focus();
      event.preventDefault(); // Предотвращаем прокрутку страницы
    }
  });
  tableSizeSelector.addEventListener("input", (event) => {
    const inputValue = event.target.valueAsNumber;
    if (isNaN(inputValue) || inputValue < 5 || inputValue > 20) {
      return;
    }
    updateTableSize(inputValue);
    const updatedData = getTableData();
    drawForceGraph(updatedData);
  });
  clearTableBtn.addEventListener("click", () => {
    clearTable();
    const clearedData = getTableData();
    drawForceGraph(clearedData);
  });
  nextStepBtn.addEventListener("click", () => {
    nextStep();
  });
  stepBackBtn.addEventListener("click", () => {
    stepBack();
  });
})();
