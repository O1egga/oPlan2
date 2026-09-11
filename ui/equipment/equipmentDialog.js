import { initEquipmentForm, fillEquipmentForm } from "./equipmentForm.js"
import { saveEquipment, updateEquipment } from "./equipmentSave.js"

import { addPorts } from "./addPorts.js"
import { deletePorts } from "./deletePorts.js"
import { deleteAllPorts } from "./deleteAllPorts.js"

import { loadPorts, fillPorts } from "./equipmentPorts.js"

import { applyVisibility } from "../tree/applyVisibility.js"

// Инициализирует диалог оборудования
export function initEquipmentDialog(myDiagram, portTypes, refreshTree, refreshDiagram, tree) {

  const dialog = document.querySelector("#equipmentDialog")

  // Заполняем типы портов из БД
  const portTypeSelect = dialog.querySelector(".port-type")

  Object.values(portTypes).forEach(portType => {

    const option = document.createElement("option")

    option.value = portType.id
    option.textContent = portType.name

    portTypeSelect.append(option)

  })

  initEquipmentForm(dialog)

  dialog.addEventListener("portsChanged", () => {
    if (dialog.dataset.mode === "edit") { checkEquipmentChanges(dialog) }
  })

  dialog.addEventListener("input", () => {
    if (dialog.dataset.mode === "edit") { checkEquipmentChanges(dialog) }
  })

  dialog.addEventListener("change", () => {
    if (dialog.dataset.mode === "edit") { checkEquipmentChanges(dialog) }
  })

  // Кнопки диалога
  dialog.addEventListener("click", async (event) => {

    const addPortsButton = event.target.closest(".add-ports")
    if (addPortsButton) {

      addPorts(addPortsButton, portTypes)

      if (dialog.dataset.mode === "edit") { checkEquipmentChanges(dialog) }
      return
    }

    const deletePortsButton = event.target.closest(".delete-ports")
    if (deletePortsButton) {

      deletePorts(deletePortsButton)
      return
    }

    const deleteAllPortsButton = event.target.closest(".delete-all-ports")

    if (deleteAllPortsButton) {

      await deleteAllPorts(deleteAllPortsButton)
      return
    }

    const cancelButton = event.target.closest(".cancel-equipment")
    if (cancelButton) {
      dialog.close()

      delete dialog.dataset.mode
      delete dialog.dataset.nodeId
      delete dialog.dataset.groupId

      dialog._originalEquipmentState = null
      dialog._deletedPortIds = []

      return
    }

    const saveButton = event.target.closest(".save-equipment")

    if (saveButton) {

      try {

        const mode = dialog.dataset.mode

        if (mode === "edit") {

          const nodeId = Number(dialog.dataset.nodeId)
          const typeSelect = dialog.querySelector(".equipment-type")
          const vendorSelect = dialog.querySelector(".equipment-vendor")
          const modelSelect = dialog.querySelector(".equipment-model")
          const nameInput = dialog.querySelector(".equipment-name")
          const data = {
            nodeTypeId: Number(typeSelect.value),
            vendorId: Number(vendorSelect.value),
            modelId: Number(modelSelect.value),
            name: nameInput.value.trim()
          }

          const result = await updateEquipment(nodeId, data, dialog)

          // Обновляем Node в GoJS
          const node = myDiagram.findNodeForKey(nodeId)

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

            // Обновляем порты
            myDiagram.model.setDataProperty(
              node.data,
              "ports",
              result.ports
            )

          }

        } else {

          const groupId = Number(dialog.dataset.groupId)
          await saveEquipment(dialog, myDiagram, groupId)

          // Обновляем дерево и схему из БД
          await refreshDiagram()
          await refreshTree()
          applyVisibility(myDiagram, tree)
        }
        dialog.close()

        // Сбрасываем режим
        delete dialog.dataset.mode
        delete dialog.dataset.nodeId
        delete dialog.dataset.groupId

      } catch (error) {

        console.error(error)
        alert("Не удалось сохранить оборудование:\n" + error.message)

      }

      return
    }

  })

}

// Открывает диалог для добавления оборудования
export function openAddEquipmentDialog(groupId) {

  const dialog = document.querySelector("#equipmentDialog")
  const title = dialog.querySelector(".equipment-dialog-title")

  title.textContent = "Добавить оборудование"

  // Режим создания
  dialog.dataset.mode = "add"
  dialog.dataset.groupId = groupId

  // Очищаем форму
  dialog.querySelector(".equipment-type").value = ""
  dialog.querySelector(".equipment-vendor").innerHTML = `<option value="">...</option>`
  dialog.querySelector(".equipment-model").innerHTML = `<option value="">...</option>`
  dialog.querySelector(".equipment-vendor").disabled = true
  dialog.querySelector(".equipment-model").disabled = true
  dialog.querySelector(".equipment-name").value = ""

  dialog.querySelector(".save-equipment").disabled = true

  dialog.showModal()
}

// Проверяет изменения оборудования и портов
function checkEquipmentChanges(dialog) {

  const original = dialog._originalEquipmentState

  if (!original) { return }

  const current = {

    nodeTypeId: Number(dialog.querySelector(".equipment-type").value),
    vendorId: Number(dialog.querySelector(".equipment-vendor").value),
    modelId: Number(dialog.querySelector(".equipment-model").value),
    name: dialog.querySelector(".equipment-name").value.trim()

  }

  const equipmentChanged =
    current.nodeTypeId !== original.nodeTypeId ||
    current.vendorId !== original.vendorId ||
    current.modelId !== original.modelId ||
    current.name !== original.name

  const portsChanged = JSON.stringify(getCurrentPorts(dialog)) !== JSON.stringify(original.ports)

  dialog.querySelector(".save-equipment").disabled = !(equipmentChanged || portsChanged)

}

// Получает текущее состояние портов из формы
function getCurrentPorts(dialog) {

  return [
    ...dialog.querySelectorAll(".ports li")
  ].map(port => ({

    portTypeId: Number(port.dataset.type),
    portNo: Number(port.querySelector(".port-number").textContent)

  }))

}

// Открывает диалог редактирования оборудования
export async function openEquipmentDialog(node, portTypes) {

  const dialog = document.querySelector("#equipmentDialog")
  const title = dialog.querySelector(".equipment-dialog-title")

  title.textContent = "Редактировать оборудование"

  // Список портов, удалённых пользователем
  dialog._deletedPortIds = []

  await fillEquipmentForm(dialog, node.data)

  const ports = await loadPorts(node.data.key)

  fillPorts(dialog, ports, portTypes)


  dialog._originalEquipmentState = {

    nodeTypeId: Number(dialog.querySelector(".equipment-type").value),
    vendorId: Number(dialog.querySelector(".equipment-vendor").value),
    modelId: Number(dialog.querySelector(".equipment-model").value),
    name: dialog.querySelector(".equipment-name").value.trim(),
    ports: ports.map(port => ({
      portTypeId: Number(port.portTypeId),
      portNo: Number(port.portNo)
    }))

  }

  dialog.querySelector(".save-equipment").disabled = true

  dialog.dataset.mode = "edit"
  dialog.dataset.nodeId = node.data.key

  dialog.showModal()
}