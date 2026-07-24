import { createPort } from "./createPort.js";

export function createSlot() {

  return new go.Panel("Vertical", {
    itemTemplate: createPort()
  })

    .bind("itemArray", "ports")
}