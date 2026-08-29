import { collectPorts, savePorts, loadPorts, deletePorts } from "./equipmentPorts.js"

export async function saveEquipment(dialog, myDiagram) {

  const typeSelect = dialog.querySelector(".equipment-type")
  const vendorSelect = dialog.querySelector(".equipment-vendor")
  const modelSelect = dialog.querySelector(".equipment-model")
  const nameInput = dialog.querySelector(".equipment-name")

  const nodeTypeId = typeSelect.value
  const name = nameInput.value.trim()
  const vendorId = vendorSelect.value
  const modelId = modelSelect.value

  const data = {
    nodeTypeId: Number(nodeTypeId),
    name: name,
    vendorId: Number(vendorId),
    modelId: Number(modelId)
  }

  console.log("Сохраняем оборудование:", data)

  // Создаём Node
  const response = await fetch("api/nodes/createNode.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })

  if (!response.ok) { throw new Error(`HTTP ошибка: ${response.status}`) }

  const result = await response.json()

  console.log("Ответ createNode.php:", result)

  if (!result.success) { throw new Error(result.error || "Ошибка сохранения оборудования") }

  const nodeId = Number(result.id)

  // Собираем порты
  const dialogPorts = collectPorts(dialog)

  // Сохраняем порты
  await savePorts(nodeId, dialogPorts)
  const ports = await loadPorts(nodeId)

  // Формируем Node для GoJS
  const nodeData = {

    key: nodeId,
    type: String(nodeTypeId),
    nodeTypeId: Number(nodeTypeId),
    vendorId: Number(vendorId),
    modelId: Number(modelId),
    vendor: vendorSelect.options[vendorSelect.selectedIndex].text,
    model: modelSelect.options[modelSelect.selectedIndex].text,
    name: name,
    ports: ports

  }

  // Добавляем Node в GoJS
  myDiagram.model.addNodeData(nodeData)

  return nodeData
}

// Обновляем оборудование в БД
export async function updateEquipment(
  nodeId,
  data,
  dialog
) {

  // ============================================
  // Обновляем оборудование
  // ============================================

  const response = await fetch(
    "api/nodes/updateNode.php",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id: nodeId,
        nodeTypeId: data.nodeTypeId,
        modelId: data.modelId,
        name: data.name
      })
    }
  )

  const result =
    await response.json()

  if (!response.ok || !result.success) {

    throw new Error(
      result.error ||
      `Ошибка обновления оборудования: ${response.status}`
    )

  }


  // ============================================
  // Удаляем порты
  // ============================================

  const deletedPortIds =
    dialog._deletedPortIds || []

  for (const portId of deletedPortIds) {

    await deletePorts(deletedPortIds)

  }


  // ============================================
  // Находим новые порты
  // ============================================

  const ports =
    collectPorts(dialog)

  const newPorts =
    ports.filter(
      port => !port.id
    )


  // ============================================
  // Сохраняем новые порты
  // ============================================

  await savePorts(
    nodeId,
    newPorts
  )


  // Получаем актуальный список портов из БД
  const updatedPorts =
    await loadPorts(nodeId)

  return {
    ...result,
    ports: updatedPorts
  }
}