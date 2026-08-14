import { renumberPorts } from "./portUtils.js"

export function deletePorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")
  const row = button.closest(".row")

  const count = Number(row.querySelector(".port-count").value)

  const type = row.querySelector(".port-type").value

  const ports = [...portList.querySelectorAll(`li[data-type="${type}"]`)]

  // Берём последние N портов
  const portsToDelete = ports.slice(-count)

  portsToDelete.forEach(port => {
    port.remove()
  })

  renumberPorts(portList, type)
}