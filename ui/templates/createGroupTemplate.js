export function createGroup(figure, fill, header) {

  return new go.Group("Auto", {

    layout: new go.LayeredDigraphLayout({
      isRealtime: false
    })

  })

    .add(

      new go.Shape(figure, {
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

          // Пустая колонка справа для симметрии
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

    );

}