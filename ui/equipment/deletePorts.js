import { renumberPorts } from "./portUtils.js"
import { showConfirmDialog } from "./confirmDialog.js"

export function deletePorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")
  const row = button.closest(".row")

  const count = Number(row.querySelector(".port-count").value)
  const type = Number(row.querySelector(".port-type").value)
  const ports = [...portList.querySelectorAll(`li[data-type="${type}"]`)]

  if (ports.length === 0) { return }

  const typeName = style.title
  const actualCount = Math.min(count, ports.length)

  showConfirmDialog(
    "Удалить порты?",
    `Удалить ${actualCount} порт(ов) типа «${typeName}»?`,

    () => {

      const portsToDelete = ports.slice(-count)

      portsToDelete.forEach(port => { port.remove() })

      renumberPorts(portList, type)
    }
  )
}