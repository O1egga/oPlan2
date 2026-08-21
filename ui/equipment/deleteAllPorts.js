import { showConfirmDialog } from "./confirmDialog.js"


export function deleteAllPorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")

  const ports = portList.querySelectorAll("li[data-type]")

  if (ports.length === 0) {
    return
  }

  showConfirmDialog(
    "Удалить все порты?",
    `Будет удалено портов: ${ports.length}.`,

    () => {
      portList.innerHTML = ""
    }
  )
}