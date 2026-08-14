import { addSlot } from "./addSlot.js"
import { deleteSlot } from "./deleteSlot.js"
import { addPort } from "./addPort.js"

export function initEquipmentDialog() {

  const dialog = document.querySelector("#equipmentDialog")

  const addSlotButton = dialog.querySelector("#addSlot")

  addSlotButton.addEventListener("click", () => {
    addSlot(addSlotButton)
  })

  dialog.addEventListener("click", (event) => {

    const deleteSlotButton = event.target.closest(".delete-slot")

    if (deleteSlotButton) {
      deleteSlot(deleteSlotButton)
      return
    }

    const addPortButton = event.target.closest(".add-ports")

    if (addPortButton) {
      addPort(addPortButton)
    }

  })
}