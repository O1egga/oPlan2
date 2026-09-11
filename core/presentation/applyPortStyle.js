// Применяет стиль Port по его типу
export function applyPortStyle(port, portTypes) {

  port.style = {

    ...portTypes[port.portTypeId]

  }

}