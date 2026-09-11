// Перенумеровывает порты выбранного типа
export function renumberPorts(portList, type) {

  const ports = [...portList.querySelectorAll(`li[data-type="${type}"]`)]

  ports.forEach((port, index) => {
    port.querySelector(".port-number").textContent = index + 1
  })
}