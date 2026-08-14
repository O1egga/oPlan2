import { configureDiagram } from "./core/utils/settings.js"
import { registerNodeTemplates } from "./ui/diagram/nodeTemplates.js"
import { registerLinkTemplates } from "./ui/diagram/linkTemplates.js"
import { registerGroupTemplates } from "./ui/diagram/groupTemplates.js"
import { loadModel } from "./core/models/loadGoModel.js"
import "./pluginJsCss/customFigures.js"

import { initEquipmentDialog } from "./ui/equipment/equipmentDialog.js"

initEquipmentDialog()

const myDiagram = new go.Diagram("myDiagramDiv", {
  "undoManager.isEnabled": true,
  layout: new go.LayeredDigraphLayout({
    isRealtime: false, // отключаем анимацию перестроения пока перетаскиваете мышью объект
  }),
})

configureDiagram(myDiagram)
registerNodeTemplates(myDiagram)
registerLinkTemplates(myDiagram)
registerGroupTemplates(myDiagram)

await loadModel(myDiagram, "./data/topologyTmp_new.json")
