import { applyPortStyle } from "./applyPortStyle.js";
import { applyLinkStyle } from "./applyLinkStyle.js";

export function applyPresentation(model) {

  //
  // Groups + Nodes
  //

  model.nodeDataArray.forEach(node => {



    //
    // Ports
    //

    if (!node.slots)
      return;

    node.slots.forEach(slot => {

      if (!slot.ports)
        return;

      slot.ports.forEach(port => {

        applyPortStyle(port);

      });

    });

  });

  //
  // Links
  //

  model.linkDataArray?.forEach(link => {

    applyLinkStyle(link);

  });

}