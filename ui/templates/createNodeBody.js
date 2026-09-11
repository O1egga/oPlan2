import { createNodeToolbar } from "./createNodeToolbar.js"
import { createPortArea } from "./createPortArea.js"

// Создаёт основную область узла !ПРОВЕРИТЬ
export function createNodeBody(PortTypes, title) {

  /*
  параметр PortTypes начинается с заглавной буквы. Для параметра функции я бы использовал portTypes:
  */

  return new go.Panel("Vertical", {
    row: 3,
    column: 0,
    columnSpan: 3,
    name: "NodeBody",
    visible: false
  })
    .add(
      createNodeToolbar(title),
      createPortArea(PortTypes)
    )

}