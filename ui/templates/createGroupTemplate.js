import { canMoveGroup } from "../../core/utils/groupMoveValidation.js"

// Проверяем конфликты имён перед перемещением
function hasNameConflict(diagram, selection, group) {

  const nodes = diagram.model.nodeDataArray

  const selectedNodes = []

  selection.each(part => { if (!part.data?.isGroup) { selectedNodes.push(part.data) } })

  // Ключи выбранного оборудования
  const selectedKeys = new Set(selectedNodes.map(node => node.key))

  // Проверяем конфликт с оборудованием, которое уже находится в целевой группе
  for (const node of selectedNodes) {

    const exists = nodes.some(item =>
      !selectedKeys.has(item.key) &&
      item.group === group.data.key &&
      item.name === node.name
    )

    if (exists) { return node.name }
  }

  // Проверяем одинаковые имена среди самого перемещения
  const names = new Set()

  for (const node of selectedNodes) {

    if (names.has(node.name)) { return node.name }

    names.add(node.name)
  }

  return null
}

export function createGroup(figure, fill, header, contextMenu, groupTypes) {

  return new go.Group("Auto", {

    // Группа пересчитывает границы после завершения перетаскивания
    computesBoundsAfterDrag: true,

    // Добавляем перетаскиваемые элементы в группу
    mouseDrop: async (event, group) => {

      const selection = event.diagram.selection

      // Проверяем возможность перемещения
      const canMove = selection.all(
        item => canMoveGroup(item, group, groupTypes)
      )

      if (!canMove) { return }

      // Проверяем конфликты имён до изменения модели
      const conflictName = hasNameConflict(
        event.diagram,
        selection,
        group
      )

      if (conflictName) {

        alert(`В группе "${group.data.text}" уже есть оборудование с именем "${conflictName}".`)
        return
      }

      // Только теперь меняем GoJS-модель
      group.addMembers(selection, true)

    },

    // Проверяем возможность помещения элемента в группу
    mouseDragEnter: (event, group, obj) => {

      const shape = group.findObject("GROUP_SHAPE")

      if (!shape) { return }

      const selection = event.diagram.selection

      // Проверяем каждый выбранный элемент
      const canMove = selection.all(item => canMoveGroup(item, group, groupTypes))

      if (canMove) { shape.strokeWidth = 4 }

    },

    // Убираем подсветку после выхода
    mouseDragLeave: (event, group, obj) => {

      const shape = group.findObject("GROUP_SHAPE")
      if (shape) { shape.strokeWidth = 2 }

    },

    layout: new go.LayeredDigraphLayout({ isRealtime: false }),
    contextMenu: contextMenu

  })

    .add(

      new go.Shape(figure, {
        name: "GROUP_SHAPE",
        fill: fill,
        stroke: header,
        strokeWidth: 2
      }),

      new go.Panel("Table")

        .addColumnDefinition(0, { width: 32 })
        .addColumnDefinition(1, { stretch: go.Stretch.Horizontal })
        .addColumnDefinition(2, { width: 32 })

        .addRowDefinition(0, { background: header })

        .add(

          // Иконка
          new go.TextBlock({
            row: 0,
            column: 0,
            stroke: "white",
            font: "20px 'Material Symbols Outlined'",
            textAlign: "center",
            alignment: go.Spot.Center
          })
            .bind("text", "icon"),

          // Название
          new go.TextBlock({
            row: 0,
            column: 1,
            stroke: "white",
            textAlign: "center",
            stretch: go.Stretch.Horizontal,
            margin: 8,
            editable: true
          })
            .bindTwoWay("text"),

          // Кнопка свернуть
          go.GraphObject.build("SubGraphExpanderButton", {
            row: 0,
            column: 2,
            margin: 4
          }),

          // Содержимое группы
          new go.Placeholder({
            row: 1,
            columnSpan: 3,
            padding: 12
          })

        )

    )
}