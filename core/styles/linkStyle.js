export function getLinkStyle(type) {
  return LINK_STYLE[type] ?? LINK_STYLE[3];
}

const LINK_STYLE = {

  1: {
    title: "Radio",
    stroke: "#3b82f6",
    strokeWidth: 2,
    strokeDashArray: [8, 4],
    // toArrow: "Standard"
  },

  2: {
    title: "Fiber",
    stroke: "#ff9800",
    strokeWidth: 2,
    strokeDashArray: null,
    // toArrow: "Standard"
  },

  3: {
    title: "Copper",
    stroke: "#4caf50",
    strokeWidth: 2,
    strokeDashArray: null,
    // toArrow: "Standard"
  }

}