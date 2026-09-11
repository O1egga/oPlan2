// Создаёт шаблон группы GoJS
export function createGroup(figure, fill, header) {

  return new go.Group("Auto", {

    // Группа изначально свернута и невидима
    isSubGraphExpanded: false,
    visible: false,

    // Группы только отображаются в GoJS
    movable: false,
    copyable: false,
    deletable: false,

    // Группа пересчитывает границы после изменения содержимого
    computesBoundsAfterDrag: true,

    layout: new go.LayeredDigraphLayout({
      isRealtime: false
    })

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
            editable: false
          })
            .bind("text"),

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