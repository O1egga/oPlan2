import { createNodeBody } from "./createNodeBody.js"
import { getDisplaySettings } from "../../core/utils/displaySettings.js"

export function createNode(fill, title, portTypes) {

  const settings = getDisplaySettings()

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

        .addColumnDefinition(0, {
          width: 20,
          sizing: go.Sizing.None
        })

        .addColumnDefinition(1)

        .addColumnDefinition(2, {
          width: 20,
          sizing: go.Sizing.None
        })

        .add(

          // Кружок
          new go.Shape("Circle", {
            row: 0,
            column: 0,
            width: 7,
            height: 7,
            fill: "lime",
            stroke: null
          }),

          // Тип оборудования
          new go.TextBlock(title, {
            row: 0,
            column: 1,
            stroke: "#000000",
            wrap: go.Wrap.None
          }),

          // Кнопка сворачивания
          go.GraphObject.build(
            "PanelExpanderButton",
            {
              row: 0,
              column: 2,
              "ButtonIcon.stroke": "#ffff00"
            },
            "NodeBody"
          ),

          // Vendor: Model
          new go.TextBlock({
            row: 1,
            column: 0,
            columnSpan: 3,
            name: "VendorModel",
            stroke: "#2f4f4f",
            visible: settings.showVendorModel
          })
            .bind(
              "text",
              "",
              data => `${data.vendor}: ${data.model}`
            ),

          // Имя оборудования
          new go.TextBlock({
            row: 2,
            column: 0,
            columnSpan: 3,
            name: "EquipmentName",
            stroke: "#ffffff",
            visible: settings.showName
          })
            .bind("text", "name"),

          // Основная часть оборудования
          createNodeBody(portTypes, title)

        )

    )

}