import { createReferenceSelector } from "./referenceSelector.js"

export async function initReferenceDialog() {

  // --------------------------------------------------
  // DOM
  // --------------------------------------------------

  const row = document.querySelector("#referenceDialogRow")

  const editDialog = document.querySelector("#referenceEditDialog")
  const editInput = document.querySelector("#referenceEditInput")
  const editCancel = document.querySelector("#referenceEditCancel")
  const editSave = document.querySelector("#referenceEditSave")

  const referenceDialog = document.querySelector("#referenceDialog")
  const referenceDialogClose =
    referenceDialog.querySelector("#reference-dialog-close")

  const relationTable = referenceDialog.querySelector("table")
  const relationTbody = relationTable.querySelector("tbody")


  // --------------------------------------------------
  // Состояние
  // --------------------------------------------------

  let currentSelector = null
  let currentValue = null

  let selectedNodeType = null
  let selectedVendor = null
  let selectedModel = null


  // --------------------------------------------------
  // Загрузка справочников
  // --------------------------------------------------

  const response = await fetch("./api/getReferences.php")

  if (!response.ok) {
    throw new Error(
      `Ошибка загрузки справочников: HTTP ${response.status}`
    )
  }

  const referenceData = await response.json()

  const nodeTypes = referenceData.nodeTypes
  const vendors = referenceData.vendors
  const models = referenceData.models
  const modelNodeTypes = referenceData.modelNodeTypes


  // --------------------------------------------------
  // ID приводим к числам
  // --------------------------------------------------

  nodeTypes.forEach(item => {
    item.id = Number(item.id)
  })

  vendors.forEach(item => {
    item.id = Number(item.id)
  })

  models.forEach(item => {
    item.id = Number(item.id)
    item.vendorId = Number(item.vendorId)
  })

  modelNodeTypes.forEach(item => {
    item.modelId = Number(item.modelId)
    item.nodeTypeId = Number(item.nodeTypeId)
  })


  console.log("Справочники загружены:", {
    nodeTypes,
    vendors,
    models,
    modelNodeTypes
  })


  // --------------------------------------------------
  // Поиск объектов
  // --------------------------------------------------

  function getNodeType(name) {
    return nodeTypes.find(item => item.name === name)
  }

  function getVendor(name) {
    return vendors.find(item => item.name === name)
  }

  function getModel(name) {
    return models.find(item => item.name === name)
  }


  // --------------------------------------------------
  // Модели для текущего выбора
  // --------------------------------------------------

  function getModelsForSelection() {

    // Type и Vendor не выбраны
    if (!selectedNodeType && !selectedVendor) {
      return models
    }


    // Только Type
    if (selectedNodeType && !selectedVendor) {

      const modelIds = new Set(
        modelNodeTypes
          .filter(item =>
            item.nodeTypeId === selectedNodeType.id
          )
          .map(item => item.modelId)
      )

      return models.filter(model =>
        modelIds.has(model.id)
      )
    }


    // Только Vendor
    if (!selectedNodeType && selectedVendor) {

      return models.filter(model =>
        model.vendorId === selectedVendor.id
      )
    }


    // Type + Vendor
    const modelIds = new Set(
      modelNodeTypes
        .filter(item =>
          item.nodeTypeId === selectedNodeType.id
        )
        .map(item => item.modelId)
    )

    return models.filter(model =>
      model.vendorId === selectedVendor.id &&
      modelIds.has(model.id)
    )
  }


  // --------------------------------------------------
  // Обновление списка моделей
  // --------------------------------------------------

  function updateModelList() {

    const modelNames =
      getModelsForSelection().map(item => item.name)

    modelSelector.load(modelNames)

    selectedModel = null
  }


  // --------------------------------------------------
  // Кнопка Add модели
  // --------------------------------------------------

  function updateModelAddButton() {

    const addButton =
      modelSelector.element.querySelector(".reference-add")

    if (!addButton) {
      return
    }

    if (!selectedNodeType || !selectedVendor) {
      addButton.style.display = "none"
      return
    }

    addButton.style.display = ""
  }


  // --------------------------------------------------
  // Обновление модели после изменения Type / Vendor
  // --------------------------------------------------

  function updateModels() {

    const modelNames =
      getModelsForSelection().map(item => item.name)

    modelSelector.load(modelNames)

    selectedModel = null

    const canAddModel =
      selectedNodeType !== null &&
      selectedVendor !== null

    modelSelector.setAddEnabled(canAddModel)
  }


  // --------------------------------------------------
  // Отрисовка таблицы связей
  // --------------------------------------------------

  function renderModelNodeTypes() {

    relationTbody.innerHTML =
      modelNodeTypes.map(relation => {

        const model = models.find(item =>
          item.id === relation.modelId
        )

        const nodeType = nodeTypes.find(item =>
          item.id === relation.nodeTypeId
        )

        if (!model || !nodeType) {
          return ""
        }

        const vendor = vendors.find(item =>
          item.id === model.vendorId
        )

        if (!vendor) {
          return ""
        }

        return `
          <tr>
            <td>${nodeType.name}</td>
            <td>${vendor.name}</td>
            <td>${model.name}</td>
            <td></td>
          </tr>
        `

      }).join("")
  }


  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  async function addReference(selector, value) {

    // ------------------------------------------------
    // Тип
    // ------------------------------------------------

    if (selector === typeSelector) {

      const response = await fetch(
        "./api/references/createNodeType.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: value
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось добавить тип"
        )

        return
      }

      nodeTypes.push({
        id: Number(result.id),
        name: result.name,
        fill: result.fill
      })

      selector.add(result.name)

      return
    }


    // ------------------------------------------------
    // Производитель
    // ------------------------------------------------

    if (selector === vendorSelector) {

      const response = await fetch(
        "./api/references/createVendor.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: value
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось добавить производителя"
        )

        return
      }

      vendors.push({
        id: Number(result.id),
        name: result.name
      })

      selector.add(result.name)

      return
    }


    // ------------------------------------------------
    // Модель
    // ------------------------------------------------

    if (selector === modelSelector) {

      // Модель нельзя добавить без существующего
      // Type и Vendor

      if (!selectedNodeType || !selectedVendor) {
        return
      }

      const response = await fetch(
        "./api/references/createModel.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: value,
            vendorId: selectedVendor.id,
            nodeTypeId: selectedNodeType.id
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось добавить модель"
        )

        return
      }

      const newModel = {
        id: Number(result.id),
        name: result.name,
        vendorId: Number(result.vendorId)
      }

      models.push(newModel)

      modelNodeTypes.push({
        modelId: newModel.id,
        nodeTypeId: selectedNodeType.id
      })

      modelSelector.load(
        getModelsForSelection().map(item => item.name)
      )

      modelSelector.add(newModel.name)

      selectedModel = newModel

      renderModelNodeTypes()
      updateModelAddButton()
    }
  }


  // --------------------------------------------------
  // Rename
  // --------------------------------------------------

  async function renameReference(
    selector,
    oldValue,
    newValue
  ) {

    // ------------------------------------------------
    // Тип
    // ------------------------------------------------

    if (selector === typeSelector) {

      const type = getNodeType(oldValue)

      if (!type) {
        return false
      }

      const response = await fetch(
        "./api/references/updateNodeType.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: type.id,
            name: newValue
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось переименовать тип"
        )

        return false
      }

      type.name = result.name
    }


    // ------------------------------------------------
    // Производитель
    // ------------------------------------------------

    else if (selector === vendorSelector) {

      const vendor = getVendor(oldValue)

      if (!vendor) {
        return false
      }

      const response = await fetch(
        "./api/references/updateVendor.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: vendor.id,
            name: newValue
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось переименовать производителя"
        )

        return false
      }

      vendor.name = result.name
    }


    // ------------------------------------------------
    // Модель
    // ------------------------------------------------

    else if (selector === modelSelector) {

      const model = getModel(oldValue)

      if (!model) {
        return false
      }

      const response = await fetch(
        "./api/references/updateModel.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: model.id,
            name: newValue
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось переименовать модель"
        )

        return false
      }

      model.name = result.name
    }


    selector.rename(oldValue, newValue)

    renderModelNodeTypes()

    return true
  }


  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  async function deleteReference(selector, value) {

    // ------------------------------------------------
    // Тип
    // ------------------------------------------------

    if (selector === typeSelector) {

      const type = getNodeType(value)

      if (!type) {
        return
      }

      if (!confirm(`Удалить тип "${value}"?`)) {
        return
      }

      const response = await fetch(
        "./api/references/deleteNodeType.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: type.id
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось удалить тип"
        )

        return
      }

      const typeIndex = nodeTypes.indexOf(type)

      if (typeIndex !== -1) {
        nodeTypes.splice(typeIndex, 1)
      }

      if (
        selectedNodeType &&
        selectedNodeType.id === type.id
      ) {
        selectedNodeType = null
      }

      typeSelector.load(
        nodeTypes.map(item => item.name)
      )

      updateModels()
      renderModelNodeTypes()

      return
    }


    // ------------------------------------------------
    // Производитель
    // ------------------------------------------------

    if (selector === vendorSelector) {

      const vendor = getVendor(value)

      if (!vendor) {
        return
      }

      if (!confirm(
        `Удалить производителя "${value}"?`
      )) {
        return
      }

      const response = await fetch(
        "./api/references/deleteVendor.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: vendor.id
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось удалить производителя"
        )

        return
      }

      const vendorIndex = vendors.indexOf(vendor)

      if (vendorIndex !== -1) {
        vendors.splice(vendorIndex, 1)
      }

      if (
        selectedVendor &&
        selectedVendor.id === vendor.id
      ) {
        selectedVendor = null
      }

      vendorSelector.load(
        vendors.map(item => item.name)
      )

      updateModels()
      renderModelNodeTypes()

      return
    }


    // ------------------------------------------------
    // Модель
    // ------------------------------------------------

    if (selector === modelSelector) {

      const model = getModel(value)

      if (!model) {
        return
      }

      if (!confirm(`Удалить модель "${value}"?`)) {
        return
      }

      const response = await fetch(
        "./api/references/deleteModel.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: model.id
          })
        }
      )

      const result = await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось удалить модель"
        )

        return
      }

      const modelIndex = models.indexOf(model)

      if (modelIndex !== -1) {
        models.splice(modelIndex, 1)
      }


      // Удаляем связи модели

      for (
        let i = modelNodeTypes.length - 1;
        i >= 0;
        i--
      ) {

        if (modelNodeTypes[i].modelId === model.id) {
          modelNodeTypes.splice(i, 1)
        }
      }

      if (
        selectedModel &&
        selectedModel.id === model.id
      ) {
        selectedModel = null
      }

      modelSelector.load(
        getModelsForSelection().map(item => item.name)
      )

      renderModelNodeTypes()
      updateModelAddButton()
    }
  }


  // --------------------------------------------------
  // Редактирование
  // --------------------------------------------------

  function editReference(selector, value) {

    currentSelector = selector
    currentValue = value

    editInput.value = value

    editDialog.showModal()
  }


  // --------------------------------------------------
  // Selector: Тип
  // --------------------------------------------------

  const typeSelector = createReferenceSelector(
    "Тип",
    nodeTypes.map(item => item.name),

    value => {

      selectedNodeType = value
        ? getNodeType(value)
        : null

      updateModels()

      console.log(
        "Выбран тип:",
        selectedNodeType
      )
    },

    value => {
      addReference(typeSelector, value)
    },

    value => {
      editReference(typeSelector, value)
    },

    value => {
      deleteReference(typeSelector, value)
    }
  )


  // --------------------------------------------------
  // Selector: Производитель
  // --------------------------------------------------

  const vendorSelector = createReferenceSelector(
    "Производитель",
    vendors.map(item => item.name),

    value => {

      selectedVendor = value
        ? getVendor(value)
        : null

      updateModels()

      console.log(
        "Выбран производитель:",
        selectedVendor
      )
    },

    value => {
      addReference(vendorSelector, value)
    },

    value => {
      editReference(vendorSelector, value)
    },

    value => {
      deleteReference(vendorSelector, value)
    }
  )


  // --------------------------------------------------
  // Selector: Модель
  // --------------------------------------------------

  const modelSelector = createReferenceSelector(
    "Модель",
    models.map(item => item.name),

    value => {

      selectedModel = value
        ? getModel(value)
        : null

      console.log(
        "Выбрана модель:",
        selectedModel
      )
    },

    value => {
      addReference(modelSelector, value)
    },

    value => {
      editReference(modelSelector, value)
    },

    value => {
      deleteReference(modelSelector, value)
    }
  )


  // --------------------------------------------------
  // Edit dialog
  // --------------------------------------------------

  editCancel.addEventListener("click", () => {
    editDialog.close()
  })


  editSave.addEventListener("click", async () => {

    const newValue = editInput.value.trim()

    if (!newValue) {
      return
    }

    if (currentSelector.hasValue(newValue, currentValue)) {

      alert("Такое значение уже существует")

      return
    }

    const success =
      await renameReference(
        currentSelector,
        currentValue,
        newValue
      )

    if (!success) {
      return
    }

    editDialog.close()
  })


  // --------------------------------------------------
  // Reference dialog
  // --------------------------------------------------

  referenceDialogClose.addEventListener("click", () => {
    referenceDialog.close()
  })


  // --------------------------------------------------
  // Добавляем selector'ы
  // --------------------------------------------------

  row.append(
    typeSelector.element,
    vendorSelector.element,
    modelSelector.element
  )


  // --------------------------------------------------
  // Первая отрисовка
  // --------------------------------------------------

  renderModelNodeTypes()
  updateModels()
}