export function applyPortStyle(port, portTypes) {

  port.style = {

    ...portTypes[port.portTypeId]

  }

}