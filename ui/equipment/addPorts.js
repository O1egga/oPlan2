import { renumberPorts } from "./portUtils.js"
import { getPortStyle } from "../../core/styles/portStyle.js"

export function addPorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")
  const row = button.closest(".row")

  const count = Number(row.querySelector(".port-count").value)

  const type = row.querySelector(".port-type").value

  const style = getPortStyle(type)

  // существующие порты этого типа
  const sameTypePorts = [...portList.querySelectorAll(`li[data-type="${type}"]`)]

  // вставляем после последнего порта этого типа
  let insertAfter = sameTypePorts.at(-1)

  // следующий номер этого типа
  let portNumber = sameTypePorts.length + 1

  for (let i = 0; i < count; i++) {

    const li = document.createElement("li")

    li.className = "no-padding"
    li.dataset.type = type

    li.innerHTML = `
      <span class="port-number">${portNumber}</span>

      <span class="chip small port-type" style="background-color: ${style.fill};">${style.title}</span>
      <div class="max"></div>
      <button class="square small fill delete-port">
        <i>delete</i>
      </button>
    `

    if (insertAfter) {
      insertAfter.after(li)
    } else {
      portList.append(li)
    }

    insertAfter = li
  }
  renumberPorts(portList, type)
}