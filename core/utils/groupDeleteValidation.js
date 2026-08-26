// Проверяет, можно ли удалить группу
export function canDeleteGroup(group) {

  // Группа должна быть пустой
  return group.memberParts.count === 0

}