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

    const saveButton =
      dialog.querySelector(".save-equipment")

    saveButton.disabled = !isValid
  }


  // Тип оборудования
  typeSelect.addEventListener("change", async () => {

    const nodeTypeId =
      typeSelect.value

    vendorSelect.innerHTML = ""
    modelSelect.innerHTML = ""

    modelSelect.disabled = true

    updateSaveButton()


    if (!nodeTypeId) {

      vendorSelect.disabled = true

      return
    }


    vendorSelect.disabled = true

    vendorSelect.innerHTML =
      `<option value="">Загрузка...</option>`


    try {

      const response =
        await fetch(
          `api/vendors.php?nodeTypeId=${nodeTypeId}`
        )


      if (!response.ok) {

        throw new Error(
          "Ошибка загрузки производителей"
        )
      }


      const vendors =
        await response.json()


      vendorSelect.innerHTML =
        `<option value="">...</option>`


      vendors.forEach(vendor => {

        const option =
          document.createElement("option")

        option.value =
          vendor.id

        option.textContent =
          vendor.name

        vendorSelect.append(option)

      })


      vendorSelect.disabled =
        vendors.length === 0

    } catch (error) {

      console.error(error)

      vendorSelect.innerHTML =
        `<option value="">Ошибка загрузки</option>`

    }

  })


  // Производитель
  vendorSelect.addEventListener("change", async () => {

    const vendorId =
      vendorSelect.value

    const nodeTypeId =
      typeSelect.value


    modelSelect.innerHTML = ""

    modelSelect.disabled = true

    updateSaveButton()


    if (!vendorId || !nodeTypeId) {

      return
    }


    modelSelect.innerHTML =
      `<option value="">Загрузка...</option>`


    try {

      const response =
        await fetch(
          `api/models.php?nodeTypeId=${nodeTypeId}&vendorId=${vendorId}`
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

      updateSaveButton()

    } catch (error) {

      console.error(error)

      modelSelect.innerHTML =
        `<option value="">Ошибка загрузки</option>`

    }

  })


  // Модель
  modelSelect.addEventListener("change", () => {

    updateSaveButton()

  })


  // Начальная загрузка типов
  loadNodeTypes(typeSelect)

}


async function loadNodeTypes(select) {

  select.innerHTML =
    `<option value="">Загрузка...</option>`


  try {

    const response =
      await fetch("api/nodeTypes.php")


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
      `<option value="">Ошибка загрузки</option>`

  }

}