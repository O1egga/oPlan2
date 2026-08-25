// Обновляем родителя оборудования в БД
export async function updateNodeParent(nodeId, groupId) {

  const response = await fetch("./api/nodes/updateNodeParent.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: nodeId,
      groupId: groupId
    })
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "Не удалось сохранить группу оборудования"
    )
  }

  return result
}