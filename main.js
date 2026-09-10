import {
  loadEquipmentDialog,
  loadReferenceDialog,
  loadSettingsDialog,
  loadTreeDialog,
  loadConfirmDialog,
  initReferenceButton,
  initSettingsButton,
  initTreeDialog
} from "./ui/interface/interface.js"

import { configureDiagram } from "./core/utils/configureDiagram.js"
import { registerNodeTemplates } from "./ui/templates/registerNodeTemplates.js"
import { registerLinkTemplates } from "./ui/templates/registerLinkTemplates.js"
import { registerGroupTemplates } from "./ui/templates/registerGroupTemplates.js"
import { loadModel } from "./core/models/loadGoModel.js"
import "./pluginJsCss/customFigures.js"
import { initEquipmentDialog } from "./ui/equipment/equipmentDialog.js"
import { registerNodeModelListener } from "./core/listeners/nodeModelListener.js"
import { initEquipmentDoubleClick } from "./ui/equipment/equipmentDoubleClick.js"
import { registerLinkModelListener } from "./core/listeners/linkModelListener.js"
import { initReferenceDialog } from "./ui/interface/referenceDialog.js"
import { initSettingsDialog } from "./ui/interface/settingsDialog.js"

const myDiagram = new go.Diagram("myDiagramDiv", {

  layout: new go.LayeredDigraphLayout({
    isRealtime: false, // отключаем анимацию перестроения пока перетаскиваете мышью объект
  }),
})

// получить типы узлов
async function loadNodeTypes() {

  const response = await fetch("./api/getNodeTypes.php")

  if (!response.ok) { throw new Error(`Ошибка загрузки NodeTypes: ${response.status}`) }

  const data = await response.json()
  return Object.fromEntries(data.map(nodeType => [nodeType.id, nodeType]))

}

// получить типы портов
async function loadPortTypes() {

  const response = await fetch("./api/getPortTypes.php")

  if (!response.ok) { throw new Error(`Ошибка загрузки PortTypes: ${response.status}`) }

  const data = await response.json()
  return Object.fromEntries(data.map(portType => [portType.id, portType]))
}

// получить типы линков
async function loadLinkTypes() {

  const response = await fetch("./api/getLinkTypes.php")

  if (!response.ok) { throw new Error(`Ошибка загрузки LinkTypes: ${response.status}`) }

  const data = await response.json()
  return Object.fromEntries(
    data.map(linkType => {

      if (linkType.strokeDashArray) {

        linkType.strokeDashArray = linkType.strokeDashArray
          .split(",")
          .map(Number)

      }

      return [linkType.id, linkType]

    })
  )
}

// получить типы групп
async function loadGroupTypes() {

  const response = await fetch("./api/getGroupTypes.php")

  if (!response.ok) { throw new Error(`Ошибка загрузки GroupTypes: ${response.status}`) }

  const data = await response.json()

  return Object.fromEntries(data.map(groupType => [groupType.id, groupType]))

}

const nodeTypes = await loadNodeTypes()
const portTypes = await loadPortTypes()
const linkTypes = await loadLinkTypes()
const groupTypes = await loadGroupTypes()

configureDiagram(myDiagram)

registerNodeTemplates(myDiagram, portTypes, nodeTypes)
registerLinkTemplates(myDiagram)

await loadEquipmentDialog()
await loadReferenceDialog()
await loadSettingsDialog()
await loadTreeDialog()
await loadConfirmDialog()

initReferenceButton()
initSettingsButton()

// Обновление схемы из БД
async function refreshDiagram() { await loadModel(myDiagram, portTypes, linkTypes) }

const { tree, refreshTree } = await initTreeDialog(myDiagram, refreshDiagram)

initSettingsDialog(myDiagram)
initEquipmentDialog(
  myDiagram,
  portTypes,
  refreshTree,
  refreshDiagram,
  tree
)

initEquipmentDoubleClick(myDiagram, portTypes)

initReferenceDialog()

registerGroupTemplates(myDiagram, groupTypes)

await loadModel(myDiagram, portTypes, linkTypes)

registerNodeModelListener(myDiagram, refreshTree)
registerLinkModelListener(myDiagram, portTypes, linkTypes, nodeTypes)
