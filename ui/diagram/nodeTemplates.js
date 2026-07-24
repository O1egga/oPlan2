// все шаблоны узлов
import { createNode } from "./createNode.js"

export function registerNodeTemplates(myDiagram) {

  Object.values(Nodes).forEach(node => {

    myDiagram.nodeTemplateMap.add(
      node.category,
      createNode(node.category, node.fill)
    )

  })

}

const Nodes = {
  default: { category: "Other", fill: "#C0C0C0" }, // Silver
  rrl: { category: "RRL", fill: "#BDB76B" }, // DarkKhaki
  wifi: { category: "Wifi", fill: "#1E90FF" }, // DodgerBlue
  bts: { category: "BTS", fill: "#008B8B" }, // DarkCyan
  router: { category: "Router", fill: "#CD5C5C" }, // IndianRed
  mux: { category: "MUX", fill: "#BC8F8F" }, // RosyBrown
  vsat: { category: "VSAT", fill: "#4682B4" }, // SteelBlue
  ats: { category: "ATS", fill: "#CD853F" }, // Peru
  dslam: { category: "DSLAM", fill: "#8FBC8F" }, // DarkSeaGreen
  msan: { category: "MSAN", fill: "#5F9EA0" }, // CadetBlue
  frame: { category: "Frame", fill: "#F5DEB3" }, // Wheat
  board: { category: "Board", fill: "#F0E68C" }, // Khaki
  cross: { category: "Cross", fill: "#6495ED" }, // CornflowerBlue},
  pc: { category: "PC", fill: "#00BFFF" }, // DeepSkyBlue },
}
