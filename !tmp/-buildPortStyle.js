import { getPortStyle } from "../core/styles/portStyle.js"

export function buildPortStyle(port) {

  port.style = getPortStyle(port.portType.id)

}