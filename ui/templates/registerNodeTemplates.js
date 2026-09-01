// все шаблоны узлов

import { createNode } from "./createNodeTemplate.js"

export function registerNodeTemplates(myDiagram, portTypes, nodeTypes) {

  Object.values(nodeTypes).forEach(nodeType => {

    myDiagram.nodeTemplateMap.add(
      String(nodeType.id),
      createNode(
        nodeType.fill,
        nodeType.name,
        portTypes
      )
    )

  })

}