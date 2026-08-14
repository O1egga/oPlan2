import { addPorts } from "./addPorts.js"
import { deletePorts } from "./deletePorts.js"
import { deleteAllPorts } from "./deleteAllPorts.js"

export function initEquipmentDialog() {

  const dialog = document.querySelector("#equipmentDialog")

  dialog.addEventListener("click", (event) => {

    const addPortButton = event.target.closest(".add-ports")

    if (addPortButton) {
      addPorts(addPortButton)
      return
    }

    const deletePortsButton = event.target.closest(".delete-ports")

    if (deletePortsButton) {
      deletePorts(deletePortsButton)
    }

    const deleteAllPortsButton =
      event.target.closest(".delete-all-ports")

    if (deleteAllPortsButton) {
      deleteAllPorts(deleteAllPortsButton)
    }

  })
}