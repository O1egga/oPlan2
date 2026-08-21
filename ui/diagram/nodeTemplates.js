// все шаблоны узлов

import { createNode } from "./createNode.js"

export function registerNodeTemplates(myDiagram, portTypes, nodeTypes) {

  Object.values(nodeTypes).forEach(nodeType => {

    myDiagram.nodeTemplateMap.add(
      nodeType.category,
      createNode(
        nodeType.category,
        nodeType.fill,
        nodeType.name,
        portTypes
      )
    )

  })

}