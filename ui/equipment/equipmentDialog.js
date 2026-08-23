import { initEquipmentForm } from "./equipmentForm.js"
import { collectPorts, loadPorts } from "./equipmentPorts.js"
import { saveEquipment } from "./equipmentSave.js"

import { addPorts } from "./addPorts.js"
import { deletePorts } from "./deletePorts.js"
import { deleteAllPorts } from "./deleteAllPorts.js"

export function initEquipmentDialog(myDiagram, portTypes) {

  const dialog = document.querySelector("#equipmentDialog")

  const typeSelect = dialog.querySelector(".equipment-type")
  const vendorSelect = dialog.querySelector(".equipment-vendor")
  const modelSelect = dialog.querySelector(".equipment-model")
  const nameInput = dialog.querySelector(".equipment-name")
  const saveButton = dialog.querySelector(".save-equipment")

  initEquipmentForm(dialog)

  // Кнопки диалога
  dialog.addEventListener("click", async (event) => {

    const addPortsButton = event.target.closest(".add-ports")
    if (addPortsButton) {
      addPorts(addPortsButton, portTypes)
      return
    }

    const deletePortsButton = event.target.closest(".delete-ports")
    if (deletePortsButton) {
      deletePorts(deletePortsButton)
      return
    }

    const deleteAllPortsButton = event.target.closest(".delete-all-ports")
    if (deleteAllPortsButton) {
      deleteAllPorts(deleteAllPortsButton)
      return
    }

    const cancelButton = event.target.closest(".cancel-equipment")
    if (cancelButton) {
      dialog.close()
      return
    }

    const saveButton = event.target.closest(".save-equipment")
    if (saveButton) {

      try {

        await saveEquipment(dialog, myDiagram)
        dialog.close()

      } catch (error) {

        console.error(error)
        alert("Не удалось сохранить оборудование:\n" + error.message)

      }

      return
    }

  })

  // Сбор портов из dialog
  function collectPorts() {

    const portList = dialog.querySelector(".ports")

    const ports = [...portList.querySelectorAll("li")]

    return ports.map(port => ({
      portTypeId: Number(port.dataset.type),
      portNo: Number(port.querySelector(".port-number").textContent),
      name: port.querySelector(".port-number").textContent
    }))

  }

}