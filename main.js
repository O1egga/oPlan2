import { configureDiagram } from "./core/utils/configureDiagram.js"
import { registerNodeTemplates } from "./ui/templates/registerNodeTemplates.js"
import { registerLinkTemplates } from "./ui/templates/registerLinkTemplates.js"
import { registerGroupTemplates } from "./ui/templates/registerGroupTemplates.js"
import { loadModel } from "./core/models/loadGoModel.js"
import "./pluginJsCss/customFigures.js"
import { initEquipmentContextMenu } from "./ui/equipment/equipmentContextMenu.js"
import { initEquipmentDialog } from "./ui/equipment/equipmentDialog.js"
import { initGroupDialog } from "./ui/groups/groupDialog.js"
import { registerGroupModelListener } from "./core/listeners/groupModelListener.js"
import { registerNodeModelListener } from "./core/listeners/nodeModelListener.js"
import { GroupCommandHandler } from "./core/commands/groupCommandHandler.js"
import { initEquipmentDoubleClick } from "./ui/equipment/equipmentDoubleClick.js"
import { registerLinkModelListener } from "./core/listeners/linkModelListener.js"

const myDiagram = new go.Diagram("myDiagramDiv", {

  commandHandler: new GroupCommandHandler(),

  layout: new go.LayeredDigraphLayout({
    isRealtime: false, // отключаем анимацию перестроения пока перетаскиваете мышью объект
  }),
})



// Обработка перемещения элементов на верхний уровень
myDiagram.mouseDrop = event => {

  const selection = event.diagram.selection

  const target = event.diagram.findPartAt(
    event.diagram.lastInput.documentPoint,
    true
  )

  // Если отпустили внутри другой группы,
  // Group.mouseDrop обработает перемещение самостоятельно
  if (
    target instanceof go.Group &&
    !selection.has(target)
  ) {
    return
  }

  // Перемещаем выбранные элементы на верхний уровень
  myDiagram.commandHandler.addTopLevelParts(selection)
}

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

initEquipmentDialog(myDiagram, portTypes)
initEquipmentDoubleClick(myDiagram, portTypes)

const groupDialog = initGroupDialog(myDiagram, groupTypes)
const contextMenu = initEquipmentContextMenu(myDiagram, groupDialog)

registerGroupTemplates(myDiagram, groupTypes, contextMenu)

await loadModel(
  myDiagram,
  portTypes,
  linkTypes
)

registerGroupModelListener(myDiagram)
registerNodeModelListener(myDiagram)
registerLinkModelListener(myDiagram, portTypes, linkTypes, nodeTypes)
