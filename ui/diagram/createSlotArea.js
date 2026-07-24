import { createSlot } from "./createSlot.js";

export function createSlotArea() {

  return new go.Panel("Vertical", {
    itemTemplate: createSlot()
  })
    .bind("itemArray", "slots")


}