import { updateLinkLabels } from "../../core/utils/updateLinkLabels.js"

// Создаёт панель кнопок узла
export function createNodeToolbar(title) {

  return new go.Panel("Horizontal")

    .add(
      // createToolbarButton("P"),
      createToolbarButton(
        "I/O",
        "откуда/куда идут линки",
        (event, button) => {

          const node = button.part

          if (!(node instanceof go.Node)) { return }

          const text = button.findObject("TOOLBAR_BUTTON_TEXT")
          const enabled = node.data.showLinkLabels === true
          const show = !enabled

          node.diagram.model.setDataProperty(
            node.data,
            "showLinkLabels",
            show
          )

          updateLinkLabels(node, show, title)

          if (text) {

            text.stroke =
              show
                ? "#ffa500"
                : "#d3d3d3"

          }

        }
      ),
      // createToolbarButton("L")
    )

}

// Создаёт кнопку панели
function createToolbarButton(label, toolTip = null, click = null) {

  const button = go.GraphObject.build("Button",
    {
      "ButtonBorder.stroke": null,
      "ButtonBorder.fill": null
    }
  )
    .add(
      new go.TextBlock(label,
        {
          name: "TOOLBAR_BUTTON_TEXT",
          stroke: "#d3d3d3",
          font: "bold 7pt sans-serif"
        }
      )
    )

  if (toolTip) {
    button.toolTip = go.GraphObject.build("ToolTip").add(new go.TextBlock(toolTip, { margin: 5 }))
  }

  if (click) { button.click = click }

  return button

}