import { openEquipmentDialog } from "./equipmentDialog.js"

export function initEquipmentDoubleClick(myDiagram, portTypes) {

  myDiagram.addDiagramListener(
    "ObjectDoubleClicked",
    async event => {

      const part = event.subject.part

      // Только оборудование
      if (
        !(part instanceof go.Node) ||
        part instanceof go.Group
      ) {
        return
      }

      try {

        await openEquipmentDialog(part, portTypes)

      } catch (error) {

        console.error(
          "Ошибка открытия оборудования:",
          error
        )

        alert(
          "Не удалось открыть оборудование:\n" +
          error.message
        )

      }

    }
  )

}