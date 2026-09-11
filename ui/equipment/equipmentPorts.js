import { createPortListItem } from "./addPorts.js"

// Собирает данные портов из формы !ПРОВЕРИТЬ
export function collectPorts(dialog) {

  /*
  Причина именно архитектурная: позже нужно сверить, зачем в Ports одновременно хранятся portNo и name, и действительно ли name должен автоматически получать значение номера.
  */

  const portList = dialog.querySelector(".ports")
  const ports = [...portList.querySelectorAll("li")]

  return ports.map(port => ({

    id: port.dataset.id ? Number(port.dataset.id) : null,
    portTypeId: Number(port.dataset.type),
    portNo: Number(port.querySelector(".port-number").textContent),
    name: port.querySelector(".port-number").textContent

  }))

}

// Сохраняет порты оборудования в БД
export async function savePorts(nodeId, ports) {

  if (ports.length === 0) { return }

  const response = await fetch("api/nodes/ports/createPorts.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: nodeId, ports: ports })
  })

  if (!response.ok) { throw new Error(`Ошибка сохранения портов: ${response.status}`) }

  const result = await response.json()

  if (!result.success) { throw new Error(result.error || "Ошибка сохранения портов") }

}

// Загружает порты оборудования из БД
export async function loadPorts(nodeId) {

  const response = await fetch(`api/nodes/ports/getPorts.php?nodeId=${nodeId}`)

  if (!response.ok) { throw new Error(`Ошибка загрузки портов: ${response.status}`) }

  return await response.json()

}

// Заполняет список портов данными оборудования
export function fillPorts(dialog, ports, portTypes) {

  const portList = dialog.querySelector(".ports")

  portList.innerHTML = ""

  ports.forEach(port => {

    const portType = portTypes[port.portTypeId]

    if (!portType) {
      console.warn("Не найден тип порта:", port.portTypeId)
      return
    }

    const li =
      createPortListItem(
        portType,
        port.portTypeId,
        port.portNo,
        port.id
      )

    portList.append(li)

  })

}

// Удаляет порты оборудования из БД
export async function deletePorts(portIds) {

  if (!portIds || portIds.length === 0) {
    return
  }

  const response = await fetch(
    "api/nodes/ports/deletePort.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ids: portIds
      })
    }
  )

  const result = await response.json()

  if (!response.ok || !result.success) {

    const error =
      new Error(
        result.error ||
        "Ошибка удаления портов"
      )

    error.usedPortIds = result.usedPortIds || []

    throw error
  }

}

// Проверяет использование портов перед удалением
export async function checkPorts(portIds) {

  if (!portIds || portIds.length === 0) {
    return []
  }

  const response = await fetch(
    "api/nodes/ports/deletePort.php",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        ids: portIds,
        checkOnly: true
      })
    }
  )

  const result =
    await response.json()

  if (!response.ok) {

    throw new Error(
      result.error ||
      "Ошибка проверки портов"
    )

  }

  return result.usedPortIds || []
}