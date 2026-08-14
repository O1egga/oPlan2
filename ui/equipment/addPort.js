export function addPort(button) {

  const slot = button.closest("article")
  const portList = slot.querySelector(".ports")
  const count = Number(slot.querySelector(".port-count").value)
  const type = slot.querySelector(".port-type").value
  const currentCount = portList.querySelectorAll("li").length

  for (let i = 1; i <= count; i++) {

    const portNumber = currentCount + i

    const li = document.createElement("li")
    li.className = "no-padding"

    li.innerHTML = `
      <span>${portNumber}</span>
      <span class="max">${type}</span>

      <button class="square small fill delete-port">
        <i>delete</i>
      </button>
    `

    portList.append(li)
  }
}