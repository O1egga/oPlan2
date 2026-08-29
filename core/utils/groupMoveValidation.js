import { canPlaceGroup } from "./groupPlacementValidation.js"

// Проверка возможности перемещения группы
export function canMoveGroup(group, targetGroup, groupTypes) {

  // Перемещение на верхний уровень разрешено
  if (!targetGroup) { return true }

  // Оборудование можно помещать в любую группу
  if (!group.data.isGroup) { return true }

  // Нельзя переместить группу внутрь самой себя
  if (group.key === targetGroup.key) { return false }

  // Нельзя переместить группу внутрь своего потомка
  let parent = targetGroup

  while (parent) {

    if (parent.key === group.key) { return false }

    parent = parent.containingGroup
  }

  // Проверяем допустимость иерархии
  return canPlaceGroup(
    group.data,
    targetGroup.data,
    groupTypes
  )

}