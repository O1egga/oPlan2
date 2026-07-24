// все шаблоны узлов

import { Nodes } from "../../core/utils/settings"

export function registerNodeTemplates(myDiagram) {
  Object.values(Nodes).forEach((node) => {
    addNodeTemplate(myDiagram, node.category, node.fill)
  })
}

// функция добавления шаблона узла
function addNodeTemplate(myDiagram, category, fill) {
  myDiagram.nodeTemplateMap.add(
    category,
    new go.Node("Auto").add(
      new go.Shape("RoundedRectangle", {
        fill: fill,
      }),
      new go.TextBlock({
        margin: 8,
      }).bind("text"),
    ),
  )
}
