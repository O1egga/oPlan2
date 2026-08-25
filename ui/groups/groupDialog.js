import { canPlaceGroup } from "../../core/utils/groupHierarchy.js"

export function initGroupDialog(myDiagram, groupTypes) {

  const dialog = document.querySelector("#groupDialog")

  const typeSelect = dialog.querySelector(".group-type")
  const nameInput = dialog.querySelector(".group-name")
  const parentInput = dialog.querySelector(".group-parent")
  const saveButton = dialog.querySelector(".save-group")

  let parentId = null

  // Проверка данных
  function updateSaveButton() {

    const isValid = typeSelect.value && nameInput.value.trim()
    saveButton.disabled = !isValid

  }

  // Название
  nameInput.addEventListener("input", () => { updateSaveButton() })

  // Тип
  typeSelect.addEventListener("change", () => { updateSaveButton() })

  // Кнопки
  dialog.addEventListener("click", event => {

    const cancelButton = event.target.closest(".cancel-group")

    if (cancelButton) {
      dialog.close()
      return
    }

    const saveButtonElement = event.target.closest(".save-group")

    if (saveButtonElement) {
      saveGroup()
      return
    }

  })

  // Открыть диалог
  function openGroupDialog(group = null) {

    parentId = group
      ? Number(String(group.key).replace("g", ""))
      : null

    parentInput.value = group
      ? group.text
      : "Нет"

    typeSelect.value = ""
    nameInput.value = ""

    updateSaveButton()

    dialog.showModal()

  }

  // Сохранить группу
  async function saveGroup() {

    const groupTypeId = Number(typeSelect.value)
    const name = nameInput.value.trim()

    // Находим родительскую группу
    const parentGroup = parentId !== null
      ? myDiagram.model.findNodeDataForKey(`g${parentId}`)
      : null

    // Проверяем допустимость вложения
    const newGroup = {
      key: `new-${Date.now()}`,
      groupTypeId: groupTypeId
    }

    if (!canPlaceGroup(newGroup, parentGroup, groupTypes)) {

      alert("Нельзя поместить эту группу внутрь выбранного родителя")

      return
    }

    const data = {
      name: name,
      groupTypeId: groupTypeId,
      parentId: parentId,
      note: ""
    }

    console.log("Сохраняем группу:", data)

    try {

      const response = await fetch("./api/groups/createGroup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      // Обработка дубликата
      if (response.status === 409) {
        alert(result.error)
        return
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Ошибка сохранения группы")
      }

      console.log("Группа создана, id:", result.id)

      const groupType = groupTypes[data.groupTypeId]

      const groupData = {
        key: `g${result.id}`,
        isGroup: true,
        type: groupType.category,
        text: data.name,
        groupTypeId: data.groupTypeId,
        note: data.note
      }

      if (parentId !== null) {
        groupData.group = `g${parentId}`
      }

      myDiagram.model.addNodeData(groupData)

      dialog.close()

    } catch (error) {

      console.error(error)
      alert("Не удалось сохранить группу:\n" + error.message)

    }

  }

  // Заполняем типы групп
  loadGroupTypes(typeSelect, groupTypes)

  // Возвращаем функцию открытия
  return { openGroupDialog }

}


// Заполнение списка типов
function loadGroupTypes(select, groupTypes) {

  select.innerHTML = `<option value="">...</option>`

  Object.values(groupTypes).forEach(groupType => {

    const option = document.createElement("option")

    option.value = groupType.id
    option.textContent = groupType.name

    select.append(option)

  })

}