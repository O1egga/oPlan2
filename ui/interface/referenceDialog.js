import { createReferenceSelector } from "./referenceSelector.js"

export async function initReferenceDialog() {

  // --------------------------------------------------
  // DOM
  // --------------------------------------------------

  const row = document.querySelector("#referenceDialogRow")

  const editDialog = document.querySelector("#referenceEditDialog")
  const editInput = document.querySelector("#referenceEditInput")
  const editColorField = document.querySelector("#referenceEditColorField")
  const editColor = document.querySelector("#referenceEditColor")
  const buttonColor = document.querySelector("#buttonColor")
  const editCancel = document.querySelector("#referenceEditCancel")
  const editSave = document.querySelector("#referenceEditSave")

  const referenceDialog = document.querySelector("#referenceDialog")
  const referenceDialogClose =
    referenceDialog.querySelector("#reference-dialog-close")


  // --------------------------------------------------
  // Состояние
  // --------------------------------------------------

  let currentSelector = null
  let currentValue = null

  let selectedNodeType = null
  let selectedVendor = null
  let selectedModel = null

  // Введённые значения Type и Vendor
  let enteredNodeType = ""
  let enteredVendor = ""


  // --------------------------------------------------
  // Загрузка справочников
  // --------------------------------------------------

  const response =
    await fetch("./api/getReferences.php")

  if (!response.ok) {
    throw new Error(
      `Ошибка загрузки справочников: HTTP ${response.status}`
    )
  }

  const referenceData =
    await response.json()

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

  nodeTypes.sort(
    (a, b) => a.name.localeCompare(b.name, "ru")
  )

  vendors.sort(
    (a, b) => a.name.localeCompare(b.name, "ru")
  )

  models.sort(
    (a, b) => a.name.localeCompare(b.name, "ru")
  )


  // --------------------------------------------------
  // Поиск объектов
  // --------------------------------------------------

  function getNodeType(name) {
    return nodeTypes.find(
      item => item.name === name
    )
  }

  function getVendor(name) {
    return vendors.find(
      item => item.name === name
    )
  }

  function getModel(name) {
    return models.find(
      item => item.name === name
    )
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
  // Обновление списков
  // --------------------------------------------------

  function updateSelectors(
    activeSelector = null,
    activeValue = null
  ) {

    // ------------------------------
    // Model
    // ------------------------------

    const modelItems =
      getModelsForSelection()

    if (activeSelector !== modelSelector) {

      modelSelector.load(
        modelItems
      )

      if (selectedModel) {
        modelSelector.setSelected(
          selectedModel
        )
      }
    }


    // ------------------------------
    // Vendor
    // ------------------------------

    let vendorItems = vendors

    if (selectedNodeType) {

      const modelIds = new Set(
        modelNodeTypes
          .filter(item =>
            item.nodeTypeId === selectedNodeType.id
          )
          .map(item => item.modelId)
      )

      vendorItems = vendors.filter(vendor =>
        models.some(model =>
          model.vendorId === vendor.id &&
          modelIds.has(model.id)
        )
      )
    }

    if (activeSelector !== vendorSelector || !selectedVendor) {

      vendorSelector.load(
        vendorItems
      )

      if (selectedVendor) {
        vendorSelector.setSelected(
          selectedVendor
        )
      }
    }


    // ------------------------------
    // Type
    // ------------------------------

    let typeItems = nodeTypes

    if (selectedVendor) {

      const modelIds = new Set(
        models
          .filter(model =>
            model.vendorId === selectedVendor.id
          )
          .map(model => model.id)
      )

      const typeIds = new Set(
        modelNodeTypes
          .filter(item =>
            modelIds.has(item.modelId)
          )
          .map(item => item.nodeTypeId)
      )

      typeItems = nodeTypes.filter(type =>
        typeIds.has(type.id)
      )
    }

    if (activeSelector !== typeSelector || !selectedNodeType) {

      typeSelector.load(
        typeItems
      )

      if (selectedNodeType) {
        typeSelector.setSelected(
          selectedNodeType
        )
      }
    }


    // ------------------------------
    // Восстановить активный input
    // ------------------------------

    if (activeSelector && activeValue !== null) {
      activeSelector.setInputValue(activeValue)
    }


    // ------------------------------
    // Add Model
    // ------------------------------

    const typeName =
      selectedNodeType
        ? selectedNodeType.name
        : enteredNodeType

    const vendorName =
      selectedVendor
        ? selectedVendor.name
        : enteredVendor

    const modelName =
      modelSelector.getInputValue
        ? modelSelector.getInputValue()
        : ""

    const canAddModel =
      typeName.trim() !== "" &&
      vendorName.trim() !== "" &&
      modelName.trim() !== ""

    modelSelector.setAddEnabled(
      canAddModel
    )
  }


  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  async function addReference(
    selector,
    value
  ) {

    // ------------------------------------------------
    // Модель
    // ------------------------------------------------

    if (selector !== modelSelector) {
      return
    }

    const modelName =
      value.trim()

    const typeName =
      selectedNodeType
        ? selectedNodeType.name
        : enteredNodeType.trim()

    const vendorName =
      selectedVendor
        ? selectedVendor.name
        : enteredVendor.trim()


    if (!typeName || !vendorName || !modelName) {
      return
    }


    // Проверяем дубликат модели
    // у этого производителя

    const exists = models.some(model => {

      if (
        selectedVendor &&
        model.vendorId !== selectedVendor.id
      ) {
        return false
      }

      if (!selectedVendor) {
        const vendor =
          vendors.find(item =>
            item.name.trim().toLowerCase() ===
            vendorName.toLowerCase()
          )

        if (
          vendor &&
          model.vendorId !== vendor.id
        ) {
          return false
        }
      }

      const modelVendor =
        vendors.find(item =>
          item.id === model.vendorId
        )

      return (
        modelVendor &&
        modelVendor.name.trim().toLowerCase() ===
        vendorName.toLowerCase() &&
        model.name.trim().toLowerCase() ===
        modelName.toLowerCase()
      )
    })

    if (exists) {
      alert(
        "У производителя уже есть такая модель"
      )
      return
    }


    // ------------------------------------------------
    // Создаём Type + Vendor + Model
    // ------------------------------------------------

    const response =
      await fetch(
        "./api/references/createModel.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: modelName,
            vendor: vendorName,
            nodeType: typeName
          })
        }
      )

    const result =
      await response.json()

    if (!response.ok) {

      alert(
        result.error ||
        "Не удалось добавить модель"
      )

      return
    }


    // ------------------------------------------------
    // Добавляем Type, если он был создан
    // ------------------------------------------------

    let newNodeType =
      getNodeType(result.nodeType)

    if (!newNodeType) {

      newNodeType = {
        id: Number(result.nodeTypeId),
        name: result.nodeType,
        fill: result.fill
      }

      nodeTypes.push(newNodeType)
    }


    // ------------------------------------------------
    // Добавляем Vendor, если он был создан
    // ------------------------------------------------

    let newVendor =
      getVendor(result.vendor)

    if (!newVendor) {

      newVendor = {
        id: Number(result.vendorId),
        name: result.vendor
      }

      vendors.push(newVendor)
    }


    // ------------------------------------------------
    // Добавляем Model
    // ------------------------------------------------

    const newModel = {
      id: Number(result.id),
      name: result.name,
      vendorId: Number(result.vendorId)
    }

    models.push(newModel)


    // ------------------------------------------------
    // Добавляем связь Model → Type
    // ------------------------------------------------

    modelNodeTypes.push({
      modelId: newModel.id,
      nodeTypeId: Number(result.nodeTypeId)
    })


    // ------------------------------------------------
    // Устанавливаем выбор
    // ------------------------------------------------

    selectedNodeType =
      newNodeType

    selectedVendor =
      newVendor

    selectedModel =
      newModel

    enteredNodeType =
      newNodeType.name

    enteredVendor =
      newVendor.name


    // ------------------------------------------------
    // Синхронизируем списки
    // ------------------------------------------------

    updateSelectors()

    modelSelector.setSelected(
      newModel
    )
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

      const type = oldValue

      if (!type) return false

      const response =
        await fetch(
          "./api/references/updateNodeType.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: type.id,
              name: newValue,
              fill: editColor.value
            })
          }
        )

      const result =
        await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось переименовать тип"
        )

        return false
      }

      type.name = result.name
      type.fill = result.fill

      if (
        selectedNodeType &&
        selectedNodeType.id === type.id
      ) {
        selectedNodeType = type
      }

      enteredNodeType = type.name
    }


    // ------------------------------------------------
    // Производитель
    // ------------------------------------------------

    else if (selector === vendorSelector) {

      const vendor = oldValue

      if (!vendor) return false

      const response =
        await fetch(
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

      const result =
        await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось переименовать производителя"
        )

        return false
      }

      vendor.name = result.name

      if (
        selectedVendor &&
        selectedVendor.id === vendor.id
      ) {
        selectedVendor = vendor
      }

      enteredVendor = vendor.name
    }


    // ------------------------------------------------
    // Модель
    // ------------------------------------------------

    else if (selector === modelSelector) {

      const model = oldValue

      if (!model) {
        return false
      }

      const response =
        await fetch(
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

      const result =
        await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось переименовать модель"
        )

        return false
      }

      model.name = result.name

      if (
        selectedModel &&
        selectedModel.id === model.id
      ) {
        selectedModel = model
      }
    }


    selector.rename(
      oldValue,
      newValue
    )

    updateSelectors()

    return true
  }


  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  async function deleteReference(
    selector,
    value
  ) {

    // ------------------------------------------------
    // Модель
    // ------------------------------------------------

    if (selector === modelSelector) {

      const model = value

      if (!model) {
        return
      }

      if (!confirm(
        `Удалить модель "${model.name}"?`
      )) {
        return
      }

      const response =
        await fetch(
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

      const result =
        await response.json()

      if (!response.ok) {

        alert(
          result.error ||
          "Не удалось удалить модель"
        )

        return
      }

      // Запоминаем Type и Vendor до удаления модели
      const vendorId = model.vendorId

      const typeId =
        modelNodeTypes.find(item =>
          item.modelId === model.id
        )?.nodeTypeId

      // Удаляем модель из локального массива
      const modelIndex =
        models.indexOf(model)

      if (modelIndex !== -1) {
        models.splice(modelIndex, 1)
      }

      // Удаляем связи модели
      for (
        let i = modelNodeTypes.length - 1;
        i >= 0;
        i--
      ) {

        if (
          modelNodeTypes[i].modelId === model.id
        ) {
          modelNodeTypes.splice(i, 1)
        }
      }

      // Если у Vendor больше нет моделей — удаляем его из памяти
      if (!models.some(item =>
        item.vendorId === vendorId
      )) {

        const vendorIndex =
          vendors.findIndex(item =>
            item.id === vendorId
          )

        if (vendorIndex !== -1) {
          vendors.splice(vendorIndex, 1)
        }
      }

      // Если у Type больше нет моделей — удаляем его из памяти
      const typeHasModels =
        modelNodeTypes.some(item =>
          item.nodeTypeId === typeId
        )

      if (
        typeId &&
        !typeHasModels
      ) {

        const typeIndex =
          nodeTypes.findIndex(item =>
            item.id === typeId
          )

        if (typeIndex !== -1) {
          nodeTypes.splice(typeIndex, 1)
        }
      }

      if (
        selectedModel &&
        selectedModel.id === model.id
      ) {
        selectedModel = null
      }

      updateSelectors()
    }
  }


  // --------------------------------------------------
  // Редактирование
  // --------------------------------------------------

  function editReference(
    selector,
    value
  ) {
    currentSelector = selector
    currentValue = value

    editInput.value = value.name

    if (selector === typeSelector) {
      editColor.value = value.fill
      buttonColor.style.backgroundColor = editColor.value
      editColorField.style.display = ""
    } else {
      editColorField.style.display = "none"
    }

    editDialog.showModal()
  }

  editColor.addEventListener("input", () => {
    buttonColor.style.backgroundColor = editColor.value
  })

  // --------------------------------------------------
  // Selector: Тип
  // --------------------------------------------------

  const typeSelector =
    createReferenceSelector(
      "Тип",
      nodeTypes,
      {

        onSelect: value => {

          selectedNodeType = value

          if (value) {
            enteredNodeType = value.name
          }

          updateSelectors()

          console.log(
            "Выбран тип:",
            selectedNodeType
          )
        },

        onInput: (value, match) => {

          enteredNodeType = value
          selectedNodeType = match

          updateSelectors(
            typeSelector,
            value
          )
        },

        onEdit: value => {
          editReference(
            typeSelector,
            value
          )
        },
        colorField: "fill"
      }
    )


  // --------------------------------------------------
  // Selector: Производитель
  // --------------------------------------------------

  const vendorSelector =
    createReferenceSelector(
      "Производитель",
      vendors,
      {

        onSelect: value => {

          selectedVendor = value

          if (value) {
            enteredVendor = value.name
          }

          updateSelectors()

          console.log(
            "Выбран производитель:",
            selectedVendor
          )
        },

        onInput: (value, match) => {

          enteredVendor = value
          selectedVendor = match

          updateSelectors(
            vendorSelector,
            value
          )
        },

        onEdit: value => {
          editReference(
            vendorSelector,
            value
          )
        }
      }
    )


  // --------------------------------------------------
  // Selector: Модель
  // --------------------------------------------------

  const modelSelector =
    createReferenceSelector(
      "Модель",
      models,
      {
        leftIcon: "playlist_add",

        onSelect: value => {

          selectedModel = value

          if (selectedModel) {

            selectedVendor =
              vendors.find(vendor =>
                vendor.id === selectedModel.vendorId
              ) || null

            const typeLink =
              modelNodeTypes.find(item =>
                item.modelId === selectedModel.id
              )

            selectedNodeType =
              typeLink
                ? nodeTypes.find(type =>
                  type.id === typeLink.nodeTypeId
                )
                : null

            if (selectedNodeType) {
              enteredNodeType =
                selectedNodeType.name
            }

            if (selectedVendor) {
              enteredVendor =
                selectedVendor.name
            }

            updateSelectors()
          }

          console.log(
            "Выбрана модель:",
            selectedModel
          )
        },

        onInput: (value, match) => {

          selectedModel = match

          updateSelectors(
            modelSelector,
            value
          )
        },

        onAdd: value => {
          addReference(
            modelSelector,
            value
          )
        },

        onEdit: value => {
          editReference(
            modelSelector,
            value
          )
        },

        onDelete: value => {
          deleteReference(
            modelSelector,
            value
          )
        }
      }
    )


  // --------------------------------------------------
  // Edit dialog
  // --------------------------------------------------

  editCancel.addEventListener(
    "click",
    () => {
      editDialog.close()
    }
  )


  editSave.addEventListener(
    "click",
    async () => {

      const newValue =
        editInput.value.trim()

      if (!newValue) {
        return
      }

      if (
        currentSelector.hasValue(
          newValue,
          currentValue
        )
      ) {
        alert(
          "Такое значение уже существует"
        )

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
    }
  )


  // --------------------------------------------------
  // Reference dialog
  // --------------------------------------------------

  referenceDialogClose.addEventListener(
    "click",
    () => {
      referenceDialog.close()
    }
  )


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

  updateSelectors()
}