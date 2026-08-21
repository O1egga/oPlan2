import { renumberPorts } from "./portUtils.js"

export function addPorts(button) {

  const dialog = button.closest("dialog")
  const portList = dialog.querySelector(".ports")
  const row = button.closest(".row")

  const count = Number(row.querySelector(".port-count").value)
  const type = Number(row.querySelector(".port-type").value)

  // Находим последний порт этого типа
  const sameTypePorts = [...portList.querySelectorAll(`li[data-type="${type}"]`)]

  // вставляем после последнего порта этого типа
  let insertAfter = sameTypePorts.at(-1)

  for (let i = 0; i < count; i++) {

    const li = document.createElement("li")

    li.className = "grid"
    li.dataset.type = type

    li.innerHTML = `
      <span class="s1 port-number"></span>
      <span class="s4 chip small port-type" style="background-color: ${style.fill};">${style.title}</span>
      <span class="s7"></span>
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