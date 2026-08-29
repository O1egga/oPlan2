import { applyPortStyle } from "./applyPortStyle.js"
import { applyLinkStyle } from "./applyLinkStyle.js"

export function applyPresentation(model, portTypes, linkTypes) {

  //
  // Groups + Ports
  //

  model.nodeDataArray.forEach(node => {



    //
    // Ports
    //

    if (!node.ports) return

    node.ports.forEach(port => {

      applyPortStyle(port, portTypes)

    })

  })

  //
  // Links
  //

  model.linkDataArray?.forEach(link => { applyLinkStyle(link, linkTypes) })

}