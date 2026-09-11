// Настраивает параметры диаграммы
export function configureDiagram(diagram) {
  diagram.grid = new go.Panel("Grid").add(
    new go.Shape("LineH", {
      stroke: "#e6e6e6", //303030
      strokeWidth: 1,
    }),
    new go.Shape("LineV", {
      stroke: "#e6e6e6",
      strokeWidth: 1,
    }),
  )

  diagram.grid.visible = true

  // Перетаскивание концов существующих Link
  diagram.toolManager.relinkingTool.isEnabled = true
}