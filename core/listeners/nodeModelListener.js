import {
  updateNodeParent,
  deleteNode
} from "../services/nodeService.js"


// Очередь удаления оборудования
let deleteQueue = Promise.resolve()

// Количество незавершённых изменений групп
let pendingGroupUpdates = 0

// Таймер обновления дерева
let refreshTreeTimer = null

// Планируем обновление дерева
function scheduleTreeRefresh(refreshTree) {

  clearTimeout(refreshTreeTimer)

  refreshTreeTimer = setTimeout(async () => {

    if (pendingGroupUpdates > 0) {
      scheduleTreeRefresh(refreshTree)
      return
    }
    await refreshTree()

  }, 100)

}

export function registerNodeModelListener(diagram, refreshTree) {

  diagram.model.addChangedListener(event => {

    // =====================================================
    // Перемещение оборудования
    // =====================================================

    if (event.propertyName === "group") {

      const data = event.object

      if (!data || data.isGroup) { return }

      const nodeId = Number(data.key)
      const groupId = data.group
        ? Number(
          String(data.group).replace("g", "")
        )
        : null

      // Учитываем незавершённое обновление
      pendingGroupUpdates++

      updateNodeParent(nodeId, groupId)
        .catch(error => {

          console.error(
            "Ошибка сохранения группы оборудования:",
            error
          )

        })
        .finally(() => {

          // Обновление завершено
          pendingGroupUpdates--

          scheduleTreeRefresh(
            refreshTree
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
        "Добавляем оборудование в очередь удаления:",
        nodeId
      )

      deleteQueue = deleteQueue
        .then(() => {

          console.log(
            "Удаляем оборудование из БД:",
            nodeId
          )

          return deleteNode(nodeId)

        })
        .catch(error => {

          console.error(
            "Ошибка удаления оборудования из БД:",
            error
          )

        })

    }

  })

}