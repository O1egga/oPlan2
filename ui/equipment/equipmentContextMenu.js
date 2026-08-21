export function initEquipmentContextMenu(myDiagram) {

  myDiagram.contextMenu =
    go.GraphObject.build("ContextMenu")
      .add(
        go.GraphObject.build("ContextMenuButton")
          .add(
            new go.TextBlock("Добавить оборудование")
          )
          .set({
            click: () => {

              const dialog =
                document.querySelector("#equipmentDialog")

              dialog.showModal()
            }
          })
      )
}