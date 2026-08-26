import {
  updateNodeParent,
  deleteNode
} from "../services/nodeService.js"

export function registerNodeModelListener(diagram) {

  diagram.model.addChangedListener(event => {

    // =====================================================
    // Перемещение оборудования
    // =====================================================

    if (event.propertyName === "group") {

      const data = event.object

      if (!data || data.isGroup) {
        return
      }

      const nodeId = Number(data.key)

      const groupId = data.group
        ? Number(
          String(data.group).replace("g", "")
        )
        : null

      updateNodeParent(
        nodeId,
        groupId
      ).catch(error => {

        console.error(
          "Ошибка сохранения группы оборудования:",
          error
        )

      })

      return
    }


    // =====================================================
    // Удаление оборудования
    // =====================================================

    if (
      event.modelChange === "nodeDataArray" &&
      event.change === go.ChangeType.Remove
    ) {

      const node = event.oldValue

      if (!node || node.isGroup) {
        return
      }

      const nodeId = Number(node.key)

      console.log(
        "Удаляем оборудование из БД:",
        nodeId
      )

      deleteNode(nodeId).catch(error => {

        console.error(
          "Ошибка удаления оборудования из БД:",
          error
        )

      })

    }

  })

}