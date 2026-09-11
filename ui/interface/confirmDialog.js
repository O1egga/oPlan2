// Показывает окно подтверждения !ПРОВЕРИТЬ
export function showConfirmDialog(title, message, onConfirm, options = {}) {

  /*
  То есть сейчас в проекте два showConfirmDialog():
  
  ui/equipment/confirmDialog.js
  ui/interface/confirmDialog.js
  */

  const dialog = document.querySelector("#confirmDialog")

  const titleElement = dialog.querySelector(".confirm-title")
  const messageElement = dialog.querySelector(".confirm-message")
  const inputField = dialog.querySelector("#confirmInputField")
  const inputElement = dialog.querySelector("#confirmInput")
  const okButton = dialog.querySelector(".confirm-ok")
  const okText = dialog.querySelector(".confirm-ok-text")
  const cancelButton = dialog.querySelector(".confirm-cancel")

  titleElement.textContent = title
  messageElement.textContent = message

  // Настраиваем поле ввода
  inputField.hidden = !options.input
  inputElement.value = options.value || ""
  inputElement.placeholder = options.placeholder || ""

  // Настраиваем кнопку
  okText.textContent = options.okText || "Удалить"
  okButton.classList.toggle("error", !options.input)

  // Убираем старый обработчик
  okButton.replaceWith(okButton.cloneNode(true))

  const newOkButton = dialog.querySelector(".confirm-ok")

  newOkButton.addEventListener("click", async () => {

    const value = inputElement.value.trim()

    if (options.input && !value) {
      inputElement.focus()
      return
    }

    const result = options.input
      ? await onConfirm(value)
      : await onConfirm()

    // Закрываем только если обработчик завершился успешно
    if (result !== false) { dialog.close() }
  })

  cancelButton.onclick = () => { dialog.close() }

  dialog.showModal()

  if (options.input) { inputElement.focus() }
}