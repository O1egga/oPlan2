import { updateGroupParent, updateGroupName, deleteGroup } from "../services/groupService.js"

export function registerGroupModelListener(diagram) {

  diagram.model.addChangedListener(event => {

    // =====================================================
    // Перемещение группы
    // =====================================================

    if (event.propertyName === "group") {

      const data = event.object

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

      return
    }

    // =====================================================
    // Переименование группы
    // =====================================================

    if (event.propertyName === "text") {

      const group = event.object

      if (!group?.isGroup) {
        return
      }

      const groupId = Number(
        String(group.key).replace("g", "")
      )

      const name = String(group.text ?? "").trim()

      if (name === "") {
        return
      }

      console.log(
        "Сохраняем новое название группы в БД:",
        groupId,
        name
      )

      updateGroupName(
        groupId,
        name
      ).catch(error => {

        console.error(
          "Ошибка сохранения названия группы:",
          error
        )

      })

      return
    }

    // =====================================================
    // Удаление группы
    // =====================================================

    if (
      event.modelChange === "nodeDataArray" &&
      event.change === go.ChangeType.Remove
    ) {

      const group = event.oldValue

      if (!group?.isGroup) {
        return
      }

      const groupId = Number(
        String(group.key).replace("g", "")
      )

      console.log(
        "Удаляем группу из БД:",
        groupId
      )

      deleteGroup(groupId).catch(error => {

        console.error(
          "Ошибка удаления группы из БД:",
          error
        )

      })

    }

  })

}