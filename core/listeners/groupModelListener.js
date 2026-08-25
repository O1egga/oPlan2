import { updateGroupParent } from "../services/groupService.js"

export function registerGroupModelListener(diagram) {

  diagram.model.addChangedListener(event => {

    // Нас интересует только изменение свойства group
    if (event.propertyName !== "group") {
      return
    }

    const data = event.object

    // Только группы
    if (!data?.isGroup) {
      return
    }

    const groupId = Number(
      String(data.key).replace("g", "")
    )

    const parentId = data.group
      ? Number(
        String(data.group).replace("g", "")
      )
      : null

    updateGroupParent(
      groupId,
      parentId
    ).catch(error => {

      console.error(
        "Ошибка сохранения родителя группы:",
        error
      )

    })

  })

}