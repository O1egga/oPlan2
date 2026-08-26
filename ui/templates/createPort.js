export function createPort(portTypes) {

  return new go.Panel("Spot", {

    cursor: "pointer",

    portId: "",

    fromLinkable: true,
    toLinkable: true,

    margin: 1

  })

    .bind("portId", "id", id => String(id))
    .bind("width", "portTypeId", type => { return portTypes[type].width })
    .bind("height", "portTypeId", type => { return portTypes[type].height })

    .add(

      new go.Shape()

        .bind("figure", "portTypeId", type => { return portTypes[type].figure })
        .bind("fill", "portTypeId", type => { return portTypes[type].fill })
        .bind("stroke", "portTypeId", type => { return portTypes[type].stroke })
        .bind("strokeWidth", "portTypeId", type => { return portTypes[type].strokeWidth }),

      new go.TextBlock({
        editable: false,
        isMultiline: false
      })

        .bind("text", "name")
        .bind("font", "portTypeId", type => { return portTypes[type].font })
        .bind("stroke", "portTypeId", type => { return portTypes[type].textColor })

    )

}