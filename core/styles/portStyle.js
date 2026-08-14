export function getPortStyle(type) {
  return PORT_STYLE[type] ?? PORT_STYLE[10];
}

const PORT_STYLE = {

  1: {
    title: "Radio",
    figure: "Circle",
    width: 15,
    height: 15,
    fill: "#BDB76B", // DarkKhaki
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  },

  2: {
    title: "Coaxial",
    figure: "Circle",
    width: 15,
    height: 15,
    fill: "#c1f3b7", // 
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  },

  3: {
    title: "Cross",
    figure: "Diamond",
    width: 18,
    height: 18,
    fill: "#7FFFD4", // Aquamarine
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  },

  4: {
    title: "Ethernet",
    figure: "Square2",
    width: 15,
    height: 15,
    fill: "#20B2AA", // LightSeaGreen
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  },

  5: {
    title: "Optical",
    figure: "TrapezoidTriangle",
    width: 15,
    height: 15,
    fill: "#FFFF00", // Yellow
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  },

  6: {
    title: "SFP-Eth",
    figure: "Square",
    width: 15,
    height: 15,
    fill: "#20B2AA", // LightSeaGreen
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  },

  6: {
    title: "SFP-Opt",
    figure: "Square",
    width: 15,
    height: 15,
    fill: "#FFFF00", // Yellow
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  },

  10: {
    title: "Other",
    figure: "Trapezoid1",
    width: 12,
    height: 17,
    fill: "#808080", // Gray
    stroke: "#404040",
    strokeWidth: 1,
    font: "7pt sans-serif",
    textColor: "#000000"
  }

}