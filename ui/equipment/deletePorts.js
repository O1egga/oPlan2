import { renumberPorts } from "./portUtils.js"
import { showConfirmDialog } from "./confirmDialog.js"
import { checkPorts } from "./equipmentPorts.js"


export async function deletePorts(button) {

  const dialog =
    button.closest("dialog")

  const portList =
    dialog.querySelector(".ports")

  const row =
    button.closest(".row")


  const count =
    Number(
      row.querySelector(".port-count").value
    )


  const typeSelect =
    row.querySelector(".port-type")

  const type =
    Number(typeSelect.value)


  const typeName =
    typeSelect.options[
      typeSelect.selectedIndex
    ].text


  const ports =
    [
      ...portList.querySelectorAll(
        `li[data-type="${type}"]`
      )
    ]


  if (ports.length === 0) {
    return
  }


  const actualCount =
    Math.min(
      count,
      ports.length
    )


  const portsToDelete =
    ports.slice(-actualCount)


  // ============================================
  // Проверяем только существующие в БД порты
  // ============================================

  const portIds =
    portsToDelete
      .filter(port => port.dataset.id)
      .map(port => Number(port.dataset.id))


  try {

    const usedPortIds =
      await checkPorts(portIds)


    if (usedPortIds.length > 0) {

      alert(
        "Нельзя удалить порт: он используется в Link."
      )

      return

    }


  } catch (error) {

    console.error(
      "Ошибка проверки портов:",
      error
    )

    alert(
      "Не удалось проверить порты:\n" +
      error.message
    )

    return

  }


  // ============================================
  // Подтверждение
  // ============================================

  showConfirmDialog(
    "Удалить порты?",
    `Удалить ${actualCount} порт(ов) типа «${typeName}»?`,

    () => {

      if (!dialog._deletedPortIds) {
        dialog._deletedPortIds = []
      }


      portsToDelete.forEach(port => {

        if (port.dataset.id) {

          dialog._deletedPortIds.push(
            Number(port.dataset.id)
          )

        }

        port.remove()

      })

      renumberPorts(
        portList,
        type
      )

      dialog.dispatchEvent(
        new Event("portsChanged")
      )

    }
  )

}