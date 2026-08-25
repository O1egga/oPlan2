// Обновляем родителя группы в БД
export async function updateGroupParent(groupId, parentId) {

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