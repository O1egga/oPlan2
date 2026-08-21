import { applyPortStyle } from "./applyPortStyle.js"
import { applyLinkStyle } from "./applyLinkStyle.js"

export function applyPresentation(model, portTypes, linkTypes) {

  //
  // Groups + Nodes
  //

  model.nodeDataArray.forEach(node => {



    //
    // Ports
    //

    if (!node.slots) return

    node.slots.forEach(slot => {

      if (!slot.ports) return
      slot.ports.forEach(port => { applyPortStyle(port, portTypes) })

    })

  })

  //
  // Links
  //

  model.linkDataArray?.forEach(link => { applyLinkStyle(link, linkTypes) })

}