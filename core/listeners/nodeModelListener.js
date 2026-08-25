import { updateNodeParent } from "../services/nodeService.js"

export function registerNodeModelListener(diagram) {

  diagram.model.addChangedListener(event => {

    if (event.propertyName !== "group") {
      return
    }

    const data = event.object

    // Нас интересует только оборудование
    if (!data || data.isGroup) {
      return
    }

    // ID оборудования
    const nodeId = Number(data.key)

    // ID новой группы
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

  })

}