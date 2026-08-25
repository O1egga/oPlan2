export function initEquipmentContextMenu(myDiagram, groupDialog) {

  const contextMenu = go.GraphObject.build("ContextMenu")
    .add(

      go.GraphObject.build("ContextMenuButton")
        .add(new go.TextBlock("Добавить оборудование"))
        .set({
          click: () => {

            const dialog = document.querySelector("#equipmentDialog")
            dialog.showModal()

          }
        }),

      go.GraphObject.build("ContextMenuButton")
        .add(new go.TextBlock("Добавить группу"))
        .set({
          click: (event, obj) => {

            const part = obj.part.adornedPart

            const group =
              part instanceof go.Group
                ? part.data
                : null

            groupDialog.openGroupDialog(group)

          }
        })

    )

  myDiagram.contextMenu = contextMenu
  return contextMenu
}