// создание основной области узла

import { createNodeToolbar } from "./createNodeToolbar.js"
import { createPortArea } from "./createPortArea.js"

export function createNodeBody(PortTypes) {

  return new go.Panel("Vertical", {
    row: 3,
    name: "NodeBody"
  })
    .add(
      createNodeToolbar(),
      createPortArea(PortTypes)
    )

}