import { createGroup } from "./createGroup.js"

export function registerGroupTemplates(diagram) {
  Object.values(Groups).forEach(group => {

    diagram.groupTemplateMap.add(

      group.category,

      createGroup(
        group.figure,
        group.fill,
        group.header
      )

    )

  })
}

const Groups = {
  country: { category: "gCountry", figure: "Rectangle", header: "#2F5D9F", fill: "#EEF4FC" },
  region: { category: "gRegion", figure: "Rectangle", header: "#4F81BD", fill: "#F2F7FD" },
  district: { category: "gDistrict", figure: "Rectangle", header: "#4FA3A5", fill: "#EEF9F8" },
  area: { category: "gArea", figure: "Rectangle", header: "#5FAF8F", fill: "#F0FAF4" },
  town: { category: "gTown", figure: "Rectangle", header: "#6AA84F", fill: "#F3FAEF" },
  building: { category: "gBuilding", figure: "Rectangle", header: "#9BBB59", fill: "#F7FAEE" },
  room: { category: "gRoom", figure: "Rectangle", header: "#D79B42", fill: "#FEF8EB" },
  rack: { category: "gRack", figure: "Rectangle", header: "#A66A3F", fill: "#FBF3EE" },
  frame: { category: "gFrame", figure: "Rectangle", header: "#8C5E58", fill: "#F7F0EF" },
  net: { category: "gNet", figure: "Trapezoid1", header: "#7B68A8", fill: "#F4F2FA" },
}
