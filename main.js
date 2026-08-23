import { configureDiagram } from "./core/utils/settings.js"
import { registerNodeTemplates } from "./ui/templates/registerNodeTemplates.js"
import { registerLinkTemplates } from "./ui/templates/registerLinkTemplates.js"
import { registerGroupTemplates } from "./ui/templates/registerGroupTemplates.js"
import { loadModel } from "./core/models/loadGoModel.js"
import "./pluginJsCss/customFigures.js"
import { initEquipmentContextMenu } from "./ui/equipment/equipmentContextMenu.js"
import { initEquipmentDialog } from "./ui/equipment/equipmentDialog.js"


const myDiagram = new go.Diagram("myDiagramDiv", {
  "undoManager.isEnabled": true,
  layout: new go.LayeredDigraphLayout({
    isRealtime: false, // отключаем анимацию перестроения пока перетаскиваете мышью объект
  }),
})

configureDiagram(myDiagram)

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

registerNodeTemplates(myDiagram, portTypes, nodeTypes)
registerLinkTemplates(myDiagram)
registerGroupTemplates(myDiagram, groupTypes)

initEquipmentContextMenu(myDiagram, groupTypes)

initEquipmentDialog(myDiagram, portTypes)

await loadModel(
  myDiagram,
  portTypes,
  linkTypes
)

