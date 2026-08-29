export function initEquipmentContextMenu(myDiagram, groupDialog) {

  const contextMenu = go.GraphObject.build("ContextMenu")
    .add(

      go.GraphObject.build("ContextMenuButton")
        .add(new go.TextBlock("Добавить оборудование"))
        .set({
          click: () => {

            const dialog = document.querySelector("#equipmentDialog")

            dialog.querySelector(".equipment-dialog-title").textContent = "Добавить оборудование"
            dialog.dataset.mode = "create"

            delete dialog.dataset.nodeId

            dialog._originalEquipmentState = null
            dialog._deletedPortIds = []

            const typeSelect = dialog.querySelector(".equipment-type")
            const vendorSelect = dialog.querySelector(".equipment-vendor")
            const modelSelect = dialog.querySelector(".equipment-model")
            const saveButton = dialog.querySelector(".save-equipment")

            saveButton.disabled =
              !typeSelect.value ||
              !vendorSelect.value ||
              !modelSelect.value

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