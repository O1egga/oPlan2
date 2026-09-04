// Применяет выбранные элементы Wunderbaum к видимости GoJS
export function applyVisibility(diagram, tree) {

  // Сначала скрываем все группы и оборудование
  diagram.nodes.each(part => {
    part.visible = false
  })

  // Обходим всё дерево, включая частично выбранные группы
  tree.visit(node => {

    // false = элемент полностью выключен
    // true = выбран
    // undefined = частично выбран
    if (node.isSelected() === false) {
      return
    }

    let goKey

    // Группа Wunderbaum: group-5 → GoJS g5
    if (node.key.startsWith("group-")) {
      goKey = `g${node.key.replace("group-", "")}`
    }

    // Оборудование Wunderbaum: node-1 → GoJS 1
    if (node.key.startsWith("node-")) {
      goKey = Number(node.key.replace("node-", ""))
    }

    const part =
      diagram.findPartForKey(goKey)

    if (part) {
      part.visible = true
    }

  })


  // Показываем link только если видимы оба оборудования
  diagram.links.each(link => {

    link.visible =
      link.fromNode?.visible === true &&
      link.toNode?.visible === true

  })



}