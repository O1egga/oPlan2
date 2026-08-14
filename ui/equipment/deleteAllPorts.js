export function deleteAllPorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")

  portList.innerHTML = ""
}