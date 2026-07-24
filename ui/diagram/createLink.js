export function createLink() {

  return new go.Link({

    routing: go.Routing.Normal,
    curve: go.Curve.None,
    corner: 5

  })

    .add(

      new go.Shape()

        .bind("stroke", "style", style => style.stroke)
        .bind("strokeWidth", "style", style => style.strokeWidth)
        .bind("strokeDashArray", "style", style => style.strokeDashArray),

      /*
        new go.Shape({

        stroke: null

      })

        .bind("toArrow", "style", style => style.toArrow)
        .bind("fill", "style", style => style.stroke)
*/
    )

}