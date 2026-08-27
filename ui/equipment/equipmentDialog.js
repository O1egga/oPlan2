import { initEquipmentForm, fillEquipmentForm } from "./equipmentForm.js"
import { saveEquipment, updateEquipment } from "./equipmentSave.js"

import { addPorts } from "./addPorts.js"
import { deletePorts } from "./deletePorts.js"
import { deleteAllPorts } from "./deleteAllPorts.js"

import { loadPorts, fillPorts } from "./equipmentPorts.js"

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

    const saveButton =
      event.target.closest(".save-equipment")

    if (saveButton) {

      try {

        const mode =
          dialog.dataset.mode

        if (mode === "edit") {

          const nodeId =
            Number(dialog.dataset.nodeId)

          const typeSelect =
            dialog.querySelector(".equipment-type")

          const vendorSelect =
            dialog.querySelector(".equipment-vendor")

          const modelSelect =
            dialog.querySelector(".equipment-model")

          const nameInput =
            dialog.querySelector(".equipment-name")

          const data = {

            nodeTypeId:
              Number(typeSelect.value),

            vendorId:
              Number(vendorSelect.value),

            modelId:
              Number(modelSelect.value),

            name:
              nameInput.value.trim()

          }

          await updateEquipment(
            nodeId,
            data
          )

          // Обновляем Node в GoJS
          const node =
            myDiagram.findNodeForKey(nodeId)

          if (node) {

            myDiagram.model.setDataProperty(
              node.data,
              "type",
              String(data.nodeTypeId)
            )

            myDiagram.model.setDataProperty(
              node.data,
              "nodeTypeId",
              data.nodeTypeId
            )

            myDiagram.model.setDataProperty(
              node.data,
              "vendorId",
              data.vendorId
            )

            myDiagram.model.setDataProperty(
              node.data,
              "modelId",
              data.modelId
            )

            myDiagram.model.setDataProperty(
              node.data,
              "name",
              data.name
            )

            myDiagram.model.setDataProperty(
              node.data,
              "vendor",
              vendorSelect.options[
                vendorSelect.selectedIndex
              ].text
            )

            myDiagram.model.setDataProperty(
              node.data,
              "model",
              modelSelect.options[
                modelSelect.selectedIndex
              ].text
            )

          }

        } else {

          await saveEquipment(
            dialog,
            myDiagram
          )

        }

        dialog.close()

        // Сбрасываем режим
        delete dialog.dataset.mode
        delete dialog.dataset.nodeId

      } catch (error) {

        console.error(error)

        alert(
          "Не удалось сохранить оборудование:\n" +
          error.message
        )

      }

      return
    }

  })

}

export async function openEquipmentDialog(node, portTypes) {

  const dialog =
    document.querySelector("#equipmentDialog")

  await fillEquipmentForm(
    dialog,
    node.data
  )

  const ports =
    await loadPorts(node.data.key)

  fillPorts(
    dialog,
    ports,
    portTypes
  )

  dialog.dataset.mode = "edit"
  dialog.dataset.nodeId = node.data.key

  dialog.showModal()
}