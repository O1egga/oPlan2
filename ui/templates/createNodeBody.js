// создание основной области узла

import { createNodeToolbar } from "./createNodeToolbar.js"
import { createPortArea } from "./createPortArea.js"

export function createNodeBody(PortTypes, title) {

  return new go.Panel("Vertical", {
    row: 3,
    name: "NodeBody",
    visible: false
  })
    .add(
      createNodeToolbar(title),
      createPortArea(PortTypes)
    )

}