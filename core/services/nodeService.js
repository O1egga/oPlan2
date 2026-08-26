// Обновляем родителя оборудования в БД
export async function updateNodeParent(nodeId, groupId) {

  const response = await fetch("./api/nodes/updateNodeParent.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

// Удаляем оборудование из БД
export async function deleteNode(nodeId) {

  const response = await fetch("./api/nodes/deleteNode.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: nodeId
    })
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "Не удалось удалить оборудование"
    )
  }

  return result
}
