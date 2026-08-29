export function createLink() {

  return new go.Link({

    routing: go.Routing.Normal,
    curve: go.Curve.None,
    corner: 5,

    // Разрешаем изменение концов Link
    relinkableFrom: true,
    relinkableTo: true

  })

    .add(

      // ==========================================
      // Линия
      // ==========================================

      new go.Shape()

        .bind(
          "stroke",
          "style",
          style => style.stroke
        )

        .bind(
          "strokeWidth",
          "style",
          style => style.strokeWidth
        )

        .bind(
          "strokeDashArray",
          "style",
          style => style.strokeDashArray
        ),


      // ==========================================
      // Стрелка
      // ==========================================

      new go.Shape({

        toArrow: "Standard",
        stroke: null

      })
        .bind("fill", "style", style => style.stroke),


      // ==========================================
      // Подпись откуда
      // ==========================================

      createLinkLabel(
        "FROM_LABEL",
        0,
        0,
        new go.Point(10, 0),
        go.Spot.Left
      ),


      // ==========================================
      // Подпись куда
      // ==========================================

      createLinkLabel(
        "TO_LABEL",
        -1,
        0,
        new go.Point(-15, 0),
        go.Spot.Right
      ),


      // ==========================================
      // Название Link
      // ==========================================

      createLinkLabel(
        "LINK_LABEL",
        NaN,
        0.5,
        new go.Point(0, 0),
        go.Spot.Center
      )

    )

}


// ==================================================
// Создаёт Label Link
// ==================================================

function createLinkLabel(
  name,
  segmentIndex,
  segmentFraction,
  segmentOffset,
  alignmentFocus
) {

  return new go.Panel("Auto", {

    name: name,
    visible: false,
    segmentIndex: segmentIndex,
    segmentFraction: segmentFraction,
    segmentOffset: segmentOffset,
    alignmentFocus: alignmentFocus,
    segmentOrientation: go.Orientation.None

  })

    .add(

      // Фон + белая обводка
      new go.Shape("RoundedRectangle", {

        stroke: "white",
        strokeWidth: 1,
        parameter1: 4

      })
        .bind("fill", "style", style => style.stroke),

      // Текст
      new go.TextBlock({
        name: "LABEL_TEXT",
        margin: new go.Margin(0, 3, 0, 3),
        stroke: "white",
        font: "7pt sans-serif"
      })

    )

}