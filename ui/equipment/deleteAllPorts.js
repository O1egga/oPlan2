import { showConfirmDialog } from "./confirmDialog.js"
import { checkPorts } from "./equipmentPorts.js"

// Удаляет все порты после проверки их использования
export async function deleteAllPorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")
  const ports =
    [
      ...portList.querySelectorAll("li[data-type]")
    ]

  if (ports.length === 0) { return }

  // ID существующих портов
  const portIds =
    ports
      .filter(port => port.dataset.id)
      .map(port => Number(port.dataset.id))

  // Проверяем занятые порты
  try {

    const usedPortIds = await checkPorts(portIds)

    if (usedPortIds.length > 0) {

      alert("Нельзя удалить порты: один или несколько портов используются в Link.")
      return

    }

  } catch (error) {

    console.error("Ошибка проверки портов:", error)
    alert("Не удалось проверить порты:\n" + error.message)
    return

  }

  // Подтверждение
  showConfirmDialog(
    "Удалить все порты?",
    `Будет удалено портов: ${ports.length}.`,

    () => {

      if (!dialog._deletedPortIds) {
        dialog._deletedPortIds = []
      }

      ports.forEach(port => {

        if (port.dataset.id) {

          dialog._deletedPortIds.push(
            Number(port.dataset.id)
          )

        }

      })

      // Убираем порты из диалога
      portList.innerHTML = ""

      dialog.dispatchEvent(new Event("portsChanged"))

    }
  )

}