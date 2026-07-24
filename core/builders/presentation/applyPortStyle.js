import { getPortStyle } from "../../styles/portStyle.js"

export function applyPortStyle(port) {

  port.style = {
    ...getPortStyle(port.portTypeId)
  }

}