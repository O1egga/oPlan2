import { renumberPorts } from "./portUtils.js"

// Создаёт элемент списка портов
export function createPortListItem(
  portType,
  portTypeId,
  portNo,
  portId = null
) {

  const li = document.createElement("li")

  li.className = "grid tiny-margin"
  li.dataset.type = portTypeId

  if (portId !== null) { li.dataset.id = portId }

  li.innerHTML = `
    <div class="s1 port-number">${portNo}</div>
    <div class="s4 round center-align port-type" style="background-color: ${portType.fill}; padding:0px 10px 0px;">${portType.name}</div>
    <div class="s7"></div>
  `
  return li
}


// Добавляет новые порты выбранного типа
export function addPorts(button, portTypes) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")
  const row = button.closest(".row")

  const count = Number(row.querySelector(".port-count").value)

  const type = Number(row.querySelector(".port-type").value)

  const portType = portTypes[type]

  // Находим последний порт этого типа
  const sameTypePorts =
    [...portList.querySelectorAll(
      `li[data-type="${type}"]`
    )]

  // Вставляем после последнего порта этого типа
  let insertAfter = sameTypePorts.at(-1)

  for (let i = 0; i < count; i++) {

    const li = createPortListItem(
      portType,
      type,
      ""
    )

    if (insertAfter) {
      insertAfter.after(li)
    } else {
      portList.append(li)
    }

    insertAfter = li
  }

  renumberPorts(portList, type)

}