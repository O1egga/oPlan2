import { createNode } from "./createNodeTemplate.js"

// Регистрирует шаблоны узлов GoJS
export function registerNodeTemplates(diagram, portTypes, nodeTypes) {

  /*
  Функция регистрирует шаблон для каждого nodeType
  */

  Object.values(nodeTypes).forEach(nodeType => {

    diagram.nodeTemplateMap.add(
      String(nodeType.id),
      createNode(
        nodeType.fill,
        nodeType.name,
        portTypes
      )
    )

  })

}