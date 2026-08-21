// панель кнопок над портами

export function createNodeToolbar() {

  return new go.Panel("Horizontal")

    .add(
      createPortLabelButton("P"),
      createPortLabelButton("I/O"),
      createPortLabelButton("L")
    )

}

function createPortLabelButton(label) {

  return go.GraphObject.build("Button", { "ButtonBorder.stroke": null, "ButtonBorder.fill": null })
    .add(new go.TextBlock(label, { stroke: "#d3d3d3", font: "bold 7pt sans-serif" }))

}
