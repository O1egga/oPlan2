// Обновляет родителя группы в БД !Проверить
export async function updateGroupParent(groupId, parentId) {

  /*
  пока нужно проверить по фактическому использованию.
  Мы уже знаем, что перенос групп теперь должен происходить в Wunderbaum. Поэтому именно эта функция должна использоваться обработчиком переноса дерева. Если она нигде не используется — тогда после полного аудита решим, нужна ли она.
  */

  const response = await fetch("./api/groups/updateParent.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: groupId,
      parentId: parentId
    })
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "Не удалось сохранить родителя группы"
    )
  }

  return result

}

// Удаляет группу из БД
export async function deleteGroup(groupId) {

  const response = await fetch("./api/groups/deleteGroup.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: groupId
    })
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "Не удалось удалить группу"
    )
  }

  return result
}

// Обновляет название группы в БД
export async function updateGroupName(groupId, name) {

  const response = await fetch("./api/groups/updateName.php", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      id: groupId,
      name: name
    })

  })

  const result = await response.json()

  if (!response.ok || !result.success) {

    throw new Error(
      result.error || "Не удалось сохранить название группы"
    )

  }

  return result
}