export function initEquipmentForm(dialog) {

  const typeSelect = dialog.querySelector(".equipment-type")
  const vendorSelect = dialog.querySelector(".equipment-vendor")
  const modelSelect = dialog.querySelector(".equipment-model")

  // Проверка выбранных данных
  function updateSaveButton() {

    const isValid =
      typeSelect.value &&
      vendorSelect.value &&
      modelSelect.value

    const saveButton = dialog.querySelector(".save-equipment")
    saveButton.disabled = !isValid
  }


  // Тип оборудования
  typeSelect.addEventListener("change", async () => {

    const nodeTypeId = typeSelect.value

    await loadVendors(
      nodeTypeId,
      vendorSelect,
      modelSelect
    )

    updateSaveButton()

  })


  // Производитель
  vendorSelect.addEventListener("change", async () => {

    const vendorId = vendorSelect.value

    const nodeTypeId = typeSelect.value

    await loadModels(
      nodeTypeId,
      vendorId,
      modelSelect
    )

    updateSaveButton()

  })

  // Модель
  modelSelect.addEventListener("change", () => { updateSaveButton() })

  // Начальная загрузка типов
  loadNodeTypes(typeSelect)

}



// Загрузка производителей

async function loadVendors(
  nodeTypeId,
  vendorSelect,
  modelSelect
) {

  vendorSelect.innerHTML = ""
  modelSelect.innerHTML = ""

  vendorSelect.disabled = true
  modelSelect.disabled = true

  if (!nodeTypeId) { return }

  vendorSelect.innerHTML = `<option value="">Загрузка...</option>`

  try {

    const response = await fetch(`api/getVendorsForForm.php?nodeTypeId=${nodeTypeId}`)

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

}


//  Загрузка моделей

async function loadModels(
  nodeTypeId,
  vendorId,
  modelSelect
) {

  modelSelect.innerHTML = ""

  modelSelect.disabled = true

  if (!vendorId || !nodeTypeId) {
    return
  }

  modelSelect.innerHTML =
    `<option value="">Загрузка...</option>`

  try {

    const response =
      await fetch(
        `api/getModelsForForm.php?nodeTypeId=${nodeTypeId}&vendorId=${vendorId}`
      )

    if (!response.ok) {

      throw new Error(
        "Ошибка загрузки моделей"
      )

    }

    const models =
      await response.json()

    modelSelect.innerHTML =
      `<option value="">...</option>`

    models.forEach(model => {

      const option =
        document.createElement("option")

      option.value =
        model.id

      option.textContent =
        model.name

      modelSelect.append(option)

    })

    modelSelect.disabled =
      models.length === 0

  } catch (error) {

    console.error(error)

    modelSelect.innerHTML =
      `<option value="">Ошибка загрузки</option>`

  }

}


/*
 * Начальная загрузка типов
 */
async function loadNodeTypes(select) {

  select.innerHTML =
    `<option value="">Загрузка...</option>`

  try {

    const response =
      await fetch("api/getNodeTypesForForm.php")

    if (!response.ok) {

      throw new Error(
        "Ошибка загрузки типов"
      )

    }

    const nodeTypes =
      await response.json()

    select.innerHTML =
      `<option value="">...</option>`

    nodeTypes.forEach(nodeType => {

      const option =
        document.createElement("option")

      option.value =
        nodeType.id

      option.textContent =
        nodeType.name

      select.append(option)

    })

  } catch (error) {

    console.error(error)

    select.innerHTML =
      `<option value="">Ошибка загрузки типов</option>`

  }

}


/*
 * Заполнение формы при редактировании
 */
export async function fillEquipmentForm(
  dialog,
  node
) {

  const typeSelect =
    dialog.querySelector(".equipment-type")

  const vendorSelect =
    dialog.querySelector(".equipment-vendor")

  const modelSelect =
    dialog.querySelector(".equipment-model")

  const nameInput =
    dialog.querySelector(".equipment-name")


  // Название

  nameInput.value =
    node.name ?? ""


  // Тип

  typeSelect.value =
    String(node.nodeTypeId)


  // Загружаем производителей

  await loadVendors(
    typeSelect.value,
    vendorSelect,
    modelSelect
  )


  // Производитель

  vendorSelect.value =
    String(node.vendorId)


  // Загружаем модели

  await loadModels(
    typeSelect.value,
    vendorSelect.value,
    modelSelect
  )


  // Модель

  modelSelect.value =
    String(node.modelId)


  // Обновляем кнопку

  const saveButton =
    dialog.querySelector(".save-equipment")

  saveButton.disabled =
    !(
      typeSelect.value &&
      vendorSelect.value &&
      modelSelect.value
    )

}