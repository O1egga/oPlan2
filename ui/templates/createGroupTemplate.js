import { canMoveGroup } from "../../core/utils/groupMoveValidation.js"

export function createGroup(figure, fill, header, contextMenu, groupTypes) {

  return new go.Group("Auto", {

    // Группа пересчитывает границы после завершения перетаскивания
    computesBoundsAfterDrag: true,

    // Добавляем перетаскиваемые элементы в группу
    mouseDrop: async (event, group) => {

      const selection = event.diagram.selection

      // Проверяем каждый выбранный элемент
      const canMove = selection.all(
        item => canMoveGroup(item, group, groupTypes)
      )

      if (!canMove) { return }

      // Добавляем выбранные элементы в группу
      group.addMembers(selection, true)

    },

    // Проверяем возможность помещения элемента в группу
    mouseDragEnter: (event, group, obj) => {

      const shape = group.findObject("GROUP_SHAPE")

      if (!shape) { return }

      const selection = event.diagram.selection

      // Проверяем каждый выбранный элемент
      const canMove = selection.all(
        item => canMoveGroup(item, group, groupTypes)
      )

      if (canMove) {
        shape.strokeWidth = 4
      }

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

        .addColumnDefinition(0, { width: 24 })
        .addColumnDefinition(1, { stretch: go.Stretch.Horizontal })
        .addColumnDefinition(2, { width: 24 })

        .addRowDefinition(0, { background: header })

        .add(

          go.GraphObject.build("SubGraphExpanderButton", {
            row: 0,
            column: 0,
            margin: 4
          }),

          new go.TextBlock({
            row: 0,
            column: 1,
            stroke: "white",
            textAlign: "center",
            stretch: go.Stretch.Horizontal,
            margin: 8
          })
            .bind("text"),

          new go.Panel("Position", {
            row: 0,
            column: 2
          }),

          new go.Placeholder({
            row: 1,
            columnSpan: 3,
            padding: 12
          })

        )

    )
}