// создание основной области узла

import { createNodeToolbar } from "./createNodeToolbar.js"
import { createSlotArea } from "./createSlotArea.js"

export function createNodeBody() {

  return new go.Panel("Vertical", {
    row: 3,
    name: "NodeBody"
  })
    .add(
      createNodeToolbar(),
      createSlotArea()

    )

}