import { Wunderbaum } from "../../pluginJsCss/wunderbaum/wunderbaum.esm.min.js"
import { createTreeExpandHandler, initDiagramExpandSync } from "./treeExpandSync.js"
import { loadTreeData } from "./treeData.js"
import { applyVisibility } from "./applyVisibility.js"
import { initTreeContextMenu } from "./treeContextMenu.js"

// Инициализирует диалог и дерево Wunderbaum
export async function initTreeDialog(diagram, refreshDiagram) {

  /*
  получает button и dialog;
  загружает данные дерева;
  создаёт Wunderbaum;
  подключает выбор элементов к applyVisibility();
  подключает раскрытие к GoJS;
  создаёт refreshTree();
  подключает контекстное меню;
  подключает синхронизацию раскрытия;
  настраивает открытие/закрытие диалога;
  возвращает tree и refreshTree.
  */

  const button = document.querySelector("#treeButton")
  const dialog = document.querySelector("#treeDialog")

  if (!button) { throw new Error("Не найдена кнопка #treeButton") }
  if (!dialog) { throw new Error("Не найден диалог #treeDialog") }

  const data = await loadTreeData()

  dialog.show()

  const expandHandler = createTreeExpandHandler(diagram)

  const tree = new Wunderbaum({
    element: document.querySelector("#treeWunderbaum"),
    source: data,
    checkbox: true,
    selectMode: "hier", // multi

    // Изменение checkbox
    select: event => { applyVisibility(diagram, tree) },

    // Синхронизация раскрытия со схемой
    expand: expandHandler
  })

  // Обновляет дерево из БД с сохранением состояния
  async function refreshTree() {

    // Запоминаем выбранные узлы
    const selectedKeys =
      new Set(
        tree.getSelectedNodes().map(node => node.key)
      )

    // Запоминаем раскрытые узлы
    const expandedKeys = new Set()

    tree.visit(node => {

      if (node.isExpanded()) {
        expandedKeys.add(node.key)
      }

    })

    const data = await loadTreeData()

    // Перезагружаем дерево
    await tree.load(data)

    // Восстанавливаем состояние
    tree.visit(node => {

      if (selectedKeys.has(node.key)) {
        node.setSelected(true)
      }

      if (expandedKeys.has(node.key)) {
        node.setExpanded(true)
      }

    })
  }

  // Контекстное меню
  initTreeContextMenu(tree, refreshTree, refreshDiagram, diagram)

  // Синхронизация раскрытия
  initDiagramExpandSync(tree, diagram)

  // Закрывает диалог с анимацией
  function closeTreeDialog() {

    dialog.classList.add("closing")

    dialog.addEventListener("animationend", () => {

      dialog.classList.remove("closing")
      dialog.close()

    }, { once: true })

  }

  button.addEventListener("click", () => {

    if (dialog.open) {
      closeTreeDialog()
    } else {
      dialog.show()
    }

  })

  // Возвращаем дерево и функцию обновления
  return { tree, refreshTree }
}