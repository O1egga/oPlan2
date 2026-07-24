export function createPort() {

  return new go.Panel("Spot", {

    cursor: "pointer",

    portId: "",

    fromLinkable: true,
    toLinkable: true,
    margin: 1

  })

    .bind("portId", "id")

    .bind("width", "style", style => style.width)
    .bind("height", "style", style => style.height)

    .add(

      new go.Shape()

        .bind("figure", "style", style => style.figure)
        .bind("fill", "style", style => style.fill)
        .bind("stroke", "style", style => style.stroke)
        .bind("strokeWidth", "style", style => style.strokeWidth),

      new go.TextBlock({

        editable: false,
        isMultiline: false,
      })

        .bind("text", "name")
        .bind("font", "style", style => style.font)
        .bind("stroke", "style", style => style.textColor)

    );

}