import { addPorts } from "./addPorts.js"
import { deletePorts } from "./deletePorts.js"
import { deleteAllPorts } from "./deleteAllPorts.js"

export function initEquipmentDialog(myDiagram) {

  const dialog = document.querySelector("#equipmentDialog")

  const typeSelect = dialog.querySelector(".equipment-type")
  const vendorSelect = dialog.querySelector(".equipment-vendor")
  const modelSelect = dialog.querySelector(".equipment-model")
  const nameInput = dialog.querySelector(".equipment-name")
  const saveButton = dialog.querySelector(".save-equipment")

  // функция проверки выбранных данных
  function updateSaveButton() {

    const isValid =
      typeSelect.value &&
      vendorSelect.value &&
      modelSelect.value

    saveButton.disabled = !isValid

  }

  // Кнопки диалога --------------------------------
  dialog.addEventListener("click", (event) => {

    const addPortsButton = event.target.closest(".add-ports")
    if (addPortsButton) {
      addPorts(addPortsButton)
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
      saveEquipment()
      return
    }

  })

  // Тип оборудования --------------------------------
  typeSelect.addEventListener("change", async () => {

    const nodeTypeId = typeSelect.value

    vendorSelect.innerHTML = ""
    modelSelect.innerHTML = ""

    modelSelect.disabled = true

    updateSaveButton()

    if (!nodeTypeId) {
      vendorSelect.disabled = true
      return
    }

    vendorSelect.disabled = true

    vendorSelect.innerHTML = `<option value="">Загрузка...</option>`

    try {

      const response = await fetch(`api/vendors.php?nodeTypeId=${nodeTypeId}`)

      if (!response.ok) { throw new Error("Ошибка загрузки производителей") }

      const vendors = await response.json()

      vendorSelect.innerHTML = `<option value="">...</option>`

      vendors.forEach(vendor => {

        const option = document.createElement("option")
        option.value = vendor.id
        option.textContent = vendor.name
        vendorSelect.append(option)

      })

      vendorSelect.disabled = vendors.length === 0

    } catch (error) {

      console.error(error)
      vendorSelect.innerHTML = `<option value="">Ошибка загрузки</option>`

    }

  })

  // Производитель --------------------------------
  vendorSelect.addEventListener("change", async () => {

    const vendorId = vendorSelect.value
    const nodeTypeId = typeSelect.value

    modelSelect.innerHTML = ""
    modelSelect.disabled = true

    updateSaveButton()

    if (!vendorId || !nodeTypeId) { return }

    modelSelect.innerHTML = `<option value="">Загрузка...</option>`

    try {

      const response = await fetch(`api/models.php?nodeTypeId=${nodeTypeId}&vendorId=${vendorId}`)

      if (!response.ok) { throw new Error("Ошибка загрузки моделей") }

      const models = await response.json()

      modelSelect.innerHTML = `<option value="">...</option>`

      models.forEach(model => {

        const option = document.createElement("option")
        option.value = model.id
        option.textContent = model.name
        modelSelect.append(option)

      })

      modelSelect.disabled = models.length === 0

      updateSaveButton()

    } catch (error) {

      console.error(error)
      modelSelect.innerHTML = `<option value="">Ошибка загрузки</option>`

    }

  })

  // Модель ---------------------------------------
  modelSelect.addEventListener("change", () => {
    updateSaveButton()
  })

  // функция сохранить оборудование
  async function saveEquipment() {

    const nodeTypeId = typeSelect.value
    const name = nameInput.value.trim()
    const vendorId = vendorSelect.value
    const modelId = modelSelect.value

    const data = {
      nodeTypeId: Number(nodeTypeId),
      name: name,
      vendorId: Number(vendorId),
      modelId: Number(modelId)
    }

    console.log("Сохраняем оборудование:", data)

    try {

      const response = await fetch("api/nodes/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) { throw new Error(`HTTP ошибка: ${response.status}`) }

      const result = await response.json()

      console.log("Ответ create.php:", result)

      if (!result.success) { throw new Error(result.error || "Ошибка сохранения") }

      console.log("Оборудование создано, id:", result.id)

      myDiagram.model.addNodeData({
        key: Number(result.id),
        type: String(nodeTypeId),
        vendor: vendorSelect.options[vendorSelect.selectedIndex].text,
        model: modelSelect.options[modelSelect.selectedIndex].text,
        name: name,
        ports: []
      })

      dialog.close()

    } catch (error) {

      console.error(error)

      alert("Не удалось сохранить оборудование:\n" + error.message)

    }

  }

  // Начальная загрузка типов --------------------------------
  loadNodeTypes(typeSelect)

}

async function loadNodeTypes(select) {

  select.innerHTML = `<option value="">Загрузка...</option>`

  try {

    const response = await fetch("api/nodeTypes.php")

    if (!response.ok) { throw new Error("Ошибка загрузки типов") }

    const nodeTypes = await response.json()

    select.innerHTML = `<option value="">...</option>`

    nodeTypes.forEach(nodeType => {

      const option = document.createElement("option")
      option.value = nodeType.id
      option.textContent = nodeType.name

      select.append(option)

    })

  } catch (error) {

    console.error(error)
    select.innerHTML = `<option value="">Ошибка загрузки</option>`

  }

}



