import { canDeleteGroup } from "../utils/groupDeleteValidation.js"

export class GroupCommandHandler extends go.CommandHandler {

  deleteSelection() {

    const selection = this.diagram.selection

    // ============================================
    // Проверяем оборудование
    // ============================================

    const nodesWithLinks = []

    selection.each(part => {

      if (!(part instanceof go.Node)) {
        return
      }

      if (part instanceof go.Group) {
        return
      }

      if (part.findLinksConnected().count > 0) {

        nodesWithLinks.push(part)

      }

    })


    if (nodesWithLinks.length > 0) {

      alert(
        "Нельзя удалить оборудование.\n\n" +
        "Оно используется в Link."
      )

      return
    }


    // ============================================
    // Проверяем группы
    // ============================================

    const canDelete = selection.all(part => {

      // Обычные узлы уже проверены выше
      if (!(part instanceof go.Group)) {
        return true
      }

      // Группу можно удалить только если она пустая
      return canDeleteGroup(part)

    })


    if (!canDelete) {

      alert(
        "Нельзя удалить непустую группу.\n\n" +
        "Сначала переместите или удалите её содержимое."
      )

      return
    }


    // ============================================
    // Всё разрешено
    // ============================================

    super.deleteSelection()

  }

}