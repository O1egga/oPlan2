export function collectPorts(dialog) {

  const portList = dialog.querySelector(".ports")
  const ports = [...portList.querySelectorAll("li")]

  return ports.map(port => ({
    portTypeId: Number(port.dataset.type),
    portNo: Number(port.querySelector(".port-number").textContent),
    name: port.querySelector(".port-number").textContent
  }))

}

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

export async function loadPorts(nodeId) {

  const response = await fetch(`api/nodes/ports/getPorts.php?nodeId=${nodeId}`)

  if (!response.ok) { throw new Error(`Ошибка загрузки портов: ${response.status}`) }

  return await response.json()

}