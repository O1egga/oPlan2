import { collectPorts, savePorts, loadPorts } from "./equipmentPorts.js"

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
    vendor: vendorSelect.options[vendorSelect.selectedIndex].text,
    model: modelSelect.options[modelSelect.selectedIndex].text,
    name: name,
    ports: ports

  }

  // Добавляем Node в GoJS
  myDiagram.model.addNodeData(nodeData)

  return nodeData
}