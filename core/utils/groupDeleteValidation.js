// Проверяет, можно ли удалить группу !ПРОВЕРИТЬ
export function canDeleteGroup(group) {

  // Группа должна быть пустой
  return group.memberParts.count === 0

}