import { Application, Graphics, Text, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from "d3-force";

(async () => {
  const app = new Application();

  const graphCanvas = document.getElementById("graph-canvas");

  await app.init({
    canvas: graphCanvas,
    width: graphCanvas.width,
    height: graphCanvas.height,
    resolution: 2,
    autoDensity: true,
  });

  const viewport = new Viewport({
    events: app.renderer.events,
  });

  viewport.pinch().wheel().drag().decelerate();
  app.stage.addChild(viewport);

  // Настройка стилей для холста
  // app.canvas.style.position = "absolute";
  // app.canvas.style.top = "0";
  // app.canvas.style.left = "0";

  // Ваши данные
  const data = {
    nodes: [
      { id: "node1", label: "1" },
      { id: "node2", label: "2" },
      { id: "node3", label: "3" },
      { id: "node4", label: "4" },
      { id: "node5", label: "5" },
      { id: "node6", label: "6" },
      { id: "node7", label: "7" },
      { id: "node8", label: "8" },
      { id: "node9", label: "9" },
      { id: "node10", label: "10" },
      { id: "node11", label: "11" },
    ],
    links: [
      { source: "node1", target: "node5" },
      { source: "node1", target: "node7" },
      { source: "node2", target: "node7" },
      { source: "node2", target: "node6" },
      { source: "node4", target: "node11" },
      { source: "node5", target: "node3" },
      { source: "node6", target: "node4" },
      { source: "node6", target: "node8" },
      { source: "node7", target: "node4" },
      { source: "node8", target: "node10" },
      { source: "node11", target: "node9" },
    ],
  };

  // Создаем симуляцию D3-force
  const simulation = forceSimulation(data.nodes)
    .force(
      "link",
      forceLink(data.links)
        .id((d) => d.id)
        .distance(50)
    )
    .force("charge", forceManyBody().strength(-300))
    .force("center", forceCenter(app.screen.width / 2, app.screen.height / 2));

  // Контейнеры для графических элементов
  const linkContainer = new Container();
  const nodeContainer = new Container();
  const textContainer = new Container();

  viewport.addChild(linkContainer, nodeContainer, textContainer);

  // Сохраняем ссылки на графические объекты в данных узлов
  data.nodes.forEach((node) => {
    node.gfx = new Graphics();
    node.textGfx = new Text({
      text: node.label,
      style: { fill: 0xffffff, fontSize: 12 },
    });
    node.textGfx.anchor.set(0.5);
    nodeContainer.addChild(node.gfx);
    textContainer.addChild(node.textGfx);
  });

  data.links.forEach((link) => {
    link.gfx = new Graphics();
    linkContainer.addChild(link.gfx);
  });

  // Событие `tick` — сердце симуляции
  simulation.on("tick", () => {
    // 1. Отрисовка связей
    data.links.forEach((link) => {
      link.gfx.clear();
      link.gfx.moveTo(link.source.x, link.source.y);
      link.gfx.lineTo(link.target.x, link.target.y);
      link.gfx.stroke({ width: 2, color: 0x999999 });
    });

    // 2. Обновление позиций узлов и текста
    data.nodes.forEach((node) => {
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
})();
