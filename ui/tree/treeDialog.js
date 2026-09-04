import { Wunderbaum } from "../../pluginJsCss/wunderbaum/wunderbaum.esm.min.js"
import { loadTreeData } from "./treeData.js"
import { applyVisibility } from "./applyVisibility.js"

export async function initTreeDialog(diagram) {

  const button = document.querySelector("#treeButton")
  const dialog = document.querySelector("#treeDialog")

  if (!button) { throw new Error("Не найдена кнопка #treeButton") }
  if (!dialog) { throw new Error("Не найден диалог #treeDialog") }

  const data = await loadTreeData()

  dialog.show()


  const tree = new Wunderbaum({
    element: document.querySelector("#treeWunderbaum"),
    source: data,
    checkbox: true,
    selectMode: "hier",

    // Изменение checkbox
    select: event => { applyVisibility(diagram, tree) }
  })

  // Обновляем дерево из БД
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

  return refreshTree

}
