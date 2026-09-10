// Создаёт обработчик раскрытия Wunderbaum → GoJS
export function createTreeExpandHandler(diagram) {

  return event => {

    const node = event.node

    if (!node || !node.key.startsWith("group-")) {
      return
    }

    const groupId =
      node.key.replace("group-", "")

    const group =
      diagram.findPartForKey(`g${groupId}`)

    if (!group) {
      return
    }

    // Изменяет состояние группы через CommandHandler, чтобы GoJS использовал стандартную анимацию
    if (event.flag) {
      diagram.commandHandler.expandSubGraph(group)
    } else {
      diagram.commandHandler.collapseSubGraph(group)
    }
  }

}


// GoJS → Wunderbaum
export function initDiagramExpandSync(tree, diagram) {

  let syncing = false

  // Группа раскрыта в GoJS
  diagram.addDiagramListener(
    "SubGraphExpanded",
    event => {

      if (syncing) {
        return
      }

      event.subject.each(group => {

        if (!(group instanceof go.Group)) {
          return
        }

        const groupId =
          String(group.data.groupId)

        const node =
          tree.findKey(`group-${groupId}`)

        if (!node) {
          return
        }

        syncing = true

        node.setExpanded(true)

        syncing = false

      })

    }
  )

  // Группа свернута в GoJS
  diagram.addDiagramListener(
    "SubGraphCollapsed",
    event => {

      if (syncing) {
        return
      }

      event.subject.each(group => {

        if (!(group instanceof go.Group)) {
          return
        }

        const groupId =
          String(group.data.groupId)

        const node =
          tree.findKey(`group-${groupId}`)

        if (!node) {
          return
        }

        syncing = true

        node.setExpanded(false)

        syncing = false

      })

    }
  )

}