export function showConfirmDialog(title, message, onConfirm) {

  const dialog = document.querySelector("#confirmDialog")

  const titleElement = dialog.querySelector(".confirm-title")
  const messageElement = dialog.querySelector(".confirm-message")
  const okButton = dialog.querySelector(".confirm-ok")
  const cancelButton = dialog.querySelector(".confirm-cancel")


  titleElement.textContent = title
  messageElement.textContent = message


  // Убираем старые обработчики
  okButton.replaceWith(okButton.cloneNode(true))

  const newOkButton = dialog.querySelector(".confirm-ok")


  newOkButton.addEventListener("click", () => {

    dialog.close()

    onConfirm()
  })


  cancelButton.onclick = () => {
    dialog.close()
  }


  dialog.showModal()
}