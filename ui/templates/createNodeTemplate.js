import { createNodeBody } from "./createNodeBody.js"

export function createNode(fill, title, portTypes) {

  return new go.Node("Auto")

    .add(
      new go.Shape("RoundedRectangle", {
        fill,
        stroke: null
      }),

      new go.Panel("Table")

        .addRowDefinition(0)
        .addRowDefinition(1)
        .addRowDefinition(2)
        .addRowDefinition(3, { background: "#fff8dc" })

        .addColumnDefinition(0)

        .add(

          createNodeHeaderType(title),
          new go.TextBlock({ row: 1, stroke: "#2f4f4f" }).bind("text", "", data => `${data.vendor}: ${data.model}`),
          new go.TextBlock({ row: 2, stroke: "#ffffff" }).bind("text", "name"),
          createNodeBody(portTypes)
        )

    )

}

// функция создания заголовка узла с типом, индикатором и кнопкой сворачивания
function createNodeHeaderType(title) {

  return new go.Panel("Table", { row: 0, stretch: go.Stretch.Horizontal })

    .addColumnDefinition(0, { width: 20 })
    .addColumnDefinition(1)
    .addColumnDefinition(2, { width: 20 })

    .add(

      // Индикатор слева
      new go.Shape("Circle", { column: 0, width: 7, height: 7, fill: "lime", stroke: null }),

      // Тип узла
      new go.TextBlock(title, { column: 1, stroke: "#000000" }),

      // Кнопка сворачивания
      go.GraphObject.build("PanelExpanderButton", { column: 2, "ButtonIcon.stroke": "#ffff00" }, "NodeBody")
      // .add(new go.TextBlock("@"))

    )
}