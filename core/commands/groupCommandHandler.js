import { canDeleteGroup } from "../utils/groupDeleteValidation.js"

export class GroupCommandHandler extends go.CommandHandler {

  deleteSelection() {

    const selection = this.diagram.selection

    const canDelete = selection.all(part => {

      // Обычные узлы удаляем стандартно
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

    // Всё разрешено — используем стандартное удаление GoJS
    super.deleteSelection()

  }

}