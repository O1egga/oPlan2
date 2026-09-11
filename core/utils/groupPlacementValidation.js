// Проверяет возможность размещения группы
export function canPlaceGroup(group, parentGroup, groupTypes) {

  // Нет родителя — разрешаем
  if (!parentGroup) { return true }

  // Нельзя поместить группу в саму себя
  if (group.key === parentGroup.key) { return false }

  const childType = groupTypes[group.groupTypeId]
  const parentType = groupTypes[parentGroup.groupTypeId]

  if (!childType || !parentType) { return false }

  // Network может находиться внутри любого типа
  if (childType.level === null) { return true }

  // Network может находиться внутри любого типа, включая другую Network
  if (parentType.level === null) { return true }

  // Обычная иерархия:
  // родитель должен находиться выше ребёнка
  return parentType.level < childType.level

}