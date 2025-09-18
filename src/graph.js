import { Application, Graphics, Text, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from "d3-force";

let app;
let viewport;

// Функция для создания данных графа из матрицы
function createGraphDataFromMatrix(matrixData) {
  const nodes = [];
  const links = [];
  const size = matrixData.length;

  for (let i = 0; i < size; i++) {
    nodes.push({ id: `node${i + 1}`, label: `${i + 1}` });
  }

  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      if (matrixData[i][j] === 1) {
        links.push({ source: `node${i + 1}`, target: `node${j + 1}` });
      }
    }
  }

  return { nodes, links };
}

export async function drawForceGraph(matrixData) {
  // Получаем данные графа из матрицы
  const graphData = createGraphDataFromMatrix(matrixData);

  // Если приложение уже инициализировано, просто очищаем сцену
  if (viewport) {
    viewport.removeChildren();
  } else {
    // Инициализация PixiJS приложения
    const graphCanvas = document.getElementById("graph-canvas");
    app = new Application();
    await app.init({
      canvas: graphCanvas,
      resizeTo: graphCanvas.parentElement,
      height: graphCanvas.parentElement.height,
      width: graphCanvas.parentElement.width,
      backgroundColor: 0x222222,
      resolution: 2,
      autoDensity: true,
    });

    // Настройка стилей для холста
    app.canvas.style.position = "absolute";
    app.canvas.style.top = "0";
    app.canvas.style.left = "0";

    viewport = new Viewport({
      events: app.renderer.events,
    });
    viewport.pinch().wheel().drag().decelerate();
    app.stage.addChild(viewport);
  }

  // Контейнеры для графических элементов
  const linkContainer = new Container();
  const nodeContainer = new Container();
  const textContainer = new Container();

  viewport.addChild(linkContainer, nodeContainer, textContainer);

  // Создаем симуляцию D3-force
  const simulation = forceSimulation(graphData.nodes)
    .force(
      "link",
      forceLink(graphData.links)
        .id((d) => d.id)
        .distance(50)
    )
    .force("charge", forceManyBody().strength(-300))
    .force("center", forceCenter(app.screen.width / 2, app.screen.height / 2));

  // Сохраняем ссылки на графические объекты в данных узлов
  graphData.nodes.forEach((node) => {
    node.gfx = new Graphics();
    node.textGfx = new Text({
      text: node.label,
      style: { fill: 0xffffff, fontSize: 12 },
    });
    node.textGfx.anchor.set(0.5);
    nodeContainer.addChild(node.gfx);
    textContainer.addChild(node.textGfx);
  });

  graphData.links.forEach((link) => {
    link.gfx = new Graphics();
    linkContainer.addChild(link.gfx);
  });

  // Событие `tick` — сердце симуляции
  simulation.on("tick", () => {
    // 1. Отрисовка связей
    graphData.links.forEach((link) => {
      link.gfx.clear();
      link.gfx.moveTo(link.source.x, link.source.y);
      link.gfx.lineTo(link.target.x, link.target.y);
      link.gfx.stroke({ width: 2, color: 0x999999 });
    });

    // 2. Обновление позиций узлов и текста
    graphData.nodes.forEach((node) => {
      node.gfx.clear();
      node.gfx.circle(node.x, node.y, 15);
      node.gfx.fill(node.color || 0x444444);
      node.gfx.stroke({ width: 2, color: 0xcccccc });

      node.textGfx.x = node.x;
      node.textGfx.y = node.y;
    });
  });

  // Запуск отрисовки
  simulation.alpha(1).restart();
}
