import { Wunderbaum } from "../../pluginJsCss/wunderbaum/wunderbaum.esm.min.js"
import { showConfirmDialog } from "../interface/confirmDialog.js"
import { applyVisibility } from "./applyVisibility.js"
import { openAddEquipmentDialog } from "../equipment/equipmentDialog.js"
import { waitForNodeDeletes } from "../../core/listeners/nodeModelListener.js"

// Инициализирует контекстное меню дерева
export function initTreeContextMenu(tree, refreshTree, refreshDiagram, diagram) {

  const menu = document.createElement("div")
  menu.className = "tree-context-menu"
  menu.hidden = true
  document.body.appendChild(menu)

  // Узел, по которому открыли контекстное меню
  let contextNode = null

  // Обработка правой кнопки мыши
  document.body.addEventListener("contextmenu", event => {

    const treeElement = document.querySelector("#treeWunderbaum")

    if (!treeElement || !treeElement.contains(event.target)) { return }

    // Отключаем стандартное меню браузера
    event.preventDefault()

    const node = Wunderbaum.getNode(event)

    if (!node) {
      console.log("Wunderbaum node не найден", event.target)
      return
    }

    // Запоминаем выбранный узел
    contextNode = node

    const items = getMenuItems(node)

    if (!items.length) {
      menu.hidden = true
      return
    }

    menu.innerHTML = items.map(item => `
    <button type="button" data-action="${item.action}">
      <span class="tree-context-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `).join("")

    menu.hidden = false

    // Не даём меню выйти за границы окна
    const x = Math.min(event.clientX, window.innerWidth - menu.offsetWidth - 8)
    const y = Math.min(event.clientY, window.innerHeight - menu.offsetHeight - 8)

    menu.style.left = `${x}px`
    menu.style.top = `${y}px`
  })

  // Обработка выбора пункта
  menu.addEventListener("click", event => {

    const button = event.target.closest("button")

    if (!button) { return }

    const action = button.dataset.action

    console.log("Tree context action:", action)

    menu.hidden = true

    // Добавить помещение
    if (action === "add-room") {

      showConfirmDialog(
        "Добавить помещение",
        "Введите название помещения",
        async name => {

          const created = await createGroup(name, 7, contextNode)

          if (!created) { return }

          await refreshDiagram()
          await refreshTree()
          applyVisibility(diagram, tree)
        },
        {
          input: true,
          placeholder: "Название помещения",
          okText: "Сохранить"
        }
      )
    }

    // Добавить стойку
    if (action === "add-rack") {

      showConfirmDialog(
        "Добавить стойку",
        "Введите название стойки",
        async name => {

          const created = await createGroup(name, 8, contextNode)

          if (!created) { return }

          await refreshDiagram()
          await refreshTree()
          applyVisibility(diagram, tree)
        },
        {
          input: true,
          placeholder: "Название стойки",
          okText: "Сохранить"
        }
      )
    }

    // Добавить полку
    if (action === "add-shelf") {

      showConfirmDialog(
        "Добавить полку",
        "Введите название полки",
        async name => {

          const created = await createGroup(name, 9, contextNode)

          if (!created) { return }

          await refreshDiagram()
          await refreshTree()
          applyVisibility(diagram, tree)
        },
        {
          input: true,
          placeholder: "Название полки",
          okText: "Сохранить"
        }
      )
    }

    // Добавить оборудование
    if (action === "add-equipment") {

      const groupId = Number(String(contextNode.key).replace("group-", ""))

      openAddEquipmentDialog(groupId, refreshTree, refreshDiagram, diagram, tree)

      return
    }

    // Удаляем оборудование
    if (action === "delete-equipment") {

      showConfirmDialog(
        "Удалить оборудование",
        `Удалить «${contextNode.title}»?`,
        async () => {

          const nodeId = Number(
            String(contextNode.key).replace("node-", "")
          )

          const node = diagram.findNodeForKey(nodeId)

          if (!node) { return }

          // Удаляем Node из GoJS
          diagram.model.removeNodeData(node.data)

          // Ждём фактического удаления из БД
          await waitForNodeDeletes()

          // Обновляем схему и дерево
          await refreshDiagram()
          await refreshTree()
          applyVisibility(diagram, tree)

        },
        {
          okText: "Удалить"
        }
      )

      return
    }

    // Удалить помещение
    if (action === "delete-room") {
      deleteGroup(contextNode, "Удалить помещение", refreshTree, refreshDiagram, diagram, tree)
    }

    // Удалить стойку
    if (action === "delete-rack") {
      deleteGroup(contextNode, "Удалить стойку", refreshTree, refreshDiagram, diagram, tree)
    }

    // Удалить полку
    if (action === "delete-shelf") {
      deleteGroup(contextNode, "Удалить полку", refreshTree, refreshDiagram, diagram, tree)
    }

    // Переименовать помещение
    if (action === "rename-room") {
      renameGroup(contextNode, "Переименовать помещение", refreshTree, refreshDiagram, diagram, tree)
    }

    // Переименовать стойку
    if (action === "rename-rack") {
      renameGroup(contextNode, "Переименовать стойку", refreshTree, refreshDiagram, diagram, tree)
    }

    // Переименовать полку
    if (action === "rename-shelf") {
      renameGroup(contextNode, "Переименовать полку", refreshTree, refreshDiagram, diagram, tree)
    }

  })

  // Закрытие меню при обычном клике
  document.addEventListener("click", event => {

    if (!menu.contains(event.target)) {
      menu.hidden = true
    }

  })

  // Закрытие меню при Escape
  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      menu.hidden = true
    }

  })
}

// Создаёт группу через API !ПРОВЕРИТЬ
async function createGroup(name, groupTypeId, parentNode) {

  /*
  Причина — у нас уже есть:
  core/services/groupService.js
  и там есть операции с группами.
  Сейчас treeContextMenu.js сам делает:
  fetch("./api/groups/createGroup.php", ...)
  */

  const parentId = parentNode
    ? Number(String(parentNode.key).replace("group-", ""))
    : null

  const data = {
    name: name,
    groupTypeId: groupTypeId,
    parentId: parentId,
    note: ""
  }

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
      return false
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Ошибка сохранения группы")
    }

    console.log("Группа создана:", result.id)

    return true

  } catch (error) {

    console.error(error)
    alert("Не удалось сохранить группу:\n" + error.message)

    return false
  }
}

// Удаляет группу через API !ПРОВЕРИТЬ
function deleteGroup(node, title, refreshTree, refreshDiagram, diagram, tree) {

  /*
  По той же причине — есть groupService.deleteGroup().
  Кроме того, проверка:
  if (node.children?.length) {
  правильна для текущей логики дерева: нельзя удалить группу, пока в ней есть оборудование или дочерние группы.
  Но позже нужно проверить, достаточно ли этого ограничения с учётом БД. Поэтому я бы пока оставил функцию как есть
  */

  // Группа должна быть пустой
  if (node.children?.length) {

    alert(
      `Нельзя удалить «${node.title}».\n\n` +
      "Сначала удалите или переместите её содержимое."
    )

    return
  }

  const groupId = Number(
    String(node.key).replace("group-", "")
  )

  showConfirmDialog(
    title,
    `Удалить «${node.title}»?`,
    async () => {

      try {

        const response = await fetch("./api/groups/deleteGroup.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: groupId })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Ошибка удаления группы")
        }

        await refreshDiagram()
        await refreshTree()
        applyVisibility(diagram, tree)

      } catch (error) {

        console.error(error)
        alert("Не удалось удалить группу:\n" + error.message)

      }

    },
    {
      okText: "Удалить"
    }
  )
}

// Переименовывает группу через API !ПРОВЕРИТЬ
function renameGroup(node, title, refreshTree, refreshDiagram, diagram, tree) {

  /*
  Опять же, есть:
  groupService.updateGroupName()
  Сначала проверим service, потом решим, надо ли здесь заменить fetch.
  */

  showConfirmDialog(
    title,
    `Введите новое название для «${node.title}»`,
    async name => {

      const groupId = Number(
        String(node.key).replace("group-", "")
      )

      try {

        const response = await fetch("./api/groups/updateName.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: groupId,
            name: name
          })
        })

        const result = await response.json()

        if (response.status === 409) {
          alert(result.error)
          return false
        }

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Ошибка переименования группы")
        }

        await refreshDiagram()
        await refreshTree()
        applyVisibility(diagram, tree)

        return true

      } catch (error) {

        console.error(error)
        alert("Не удалось переименовать группу:\n" + error.message)

      }

    },
    {
      input: true,
      value: node.title,
      placeholder: "Название",
      okText: "Сохранить"
    }
  )
}

// Формирует пункты контекстного меню для узла дерева
function getMenuItems(node) {

  const data = node.data.data

  // Оборудование
  if (node.key.startsWith("node-")) {
    return [
      { action: "rename-equipment", label: "Переименовать оборудование", icon: "edit" },
      { action: "delete-equipment", label: "Удалить оборудование", icon: "delete" }
    ]
  }

  // Не группа
  if (!node.key.startsWith("group-") || !data) { return [] }

  switch (Number(data.groupTypeId)) {

    case 6: // Строение
      return [
        { action: "add-room", label: "Добавить помещение", icon: "add" },
        { action: "add-equipment", label: "Добавить оборудование", icon: "add" }
      ]

    case 7: // Помещение
      return [
        { action: "rename-room", label: "Переименовать помещение", icon: "edit" },
        { action: "delete-room", label: "Удалить помещение", icon: "delete" },
        { action: "add-rack", label: "Добавить стойку", icon: "add" },
        { action: "add-equipment", label: "Добавить оборудование", icon: "add" }
      ]

    case 8: // Стойка
      return [
        { action: "rename-rack", label: "Переименовать стойку", icon: "edit" },
        { action: "delete-rack", label: "Удалить стойку", icon: "delete" },
        { action: "add-shelf", label: "Добавить полку", icon: "add" },
        { action: "add-equipment", label: "Добавить оборудование", icon: "add" }
      ]

    case 9: // Полка
      return [
        { action: "rename-shelf", label: "Переименовать полку", icon: "edit" },
        { action: "delete-shelf", label: "Удалить полку", icon: "delete" },
        { action: "add-equipment", label: "Добавить оборудование", icon: "add" }
      ]

    default:
      return []
  }
}