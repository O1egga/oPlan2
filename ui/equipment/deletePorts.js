import { renumberPorts } from "./portUtils.js"
import { getPortStyle } from "../../core/styles/portStyle.js"
import { showConfirmDialog } from "./confirmDialog.js"

export function deletePorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")
  const row = button.closest(".row")

  const count = Number(row.querySelector(".port-count").value)

  const type = row.querySelector(".port-type").value

  const ports = [...portList.querySelectorAll(`li[data-type="${type}"]`)]

  if (ports.length === 0) {
    return
  }

  const style = getPortStyle(type)

  const typeName = style.title

  const actualCount = Math.min(count, ports.length)

  showConfirmDialog(
    "Удалить порты?",
    `Удалить ${actualCount} порт(ов) типа «${typeName}»?`,

    () => {

      const portsToDelete = ports.slice(-count)


      portsToDelete.forEach(port => {
        port.remove()
      })


      renumberPorts(portList, type)
    }
  )
}