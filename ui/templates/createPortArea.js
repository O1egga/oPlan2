import { createPort } from "./createPort.js"

export function createPortArea(portTypes) {

  return new go.Panel("Vertical", { itemTemplate: createPort(portTypes) })
    .bind("itemArray", "ports")

}