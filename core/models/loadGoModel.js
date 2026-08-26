// загрузка модели
import { applyPresentation } from "../builders/presentation/applyPresentation.js"

export async function loadModel(diagram, portTypes, linkTypes) {

  try {

    // Загружаем узлы
    const nodesResponse = await fetch("./api/nodes/getNodes.php")

    if (!nodesResponse.ok) {
      throw new Error(`Ошибка загрузки Nodes: HTTP ${nodesResponse.status}`)
    }
    const nodes = await nodesResponse.json()


    // Загружаем порты
    const portsResponse = await fetch("./api/nodes/ports/getPorts.php")

    if (!portsResponse.ok) {
      throw new Error(`Ошибка загрузки Ports: HTTP ${portsResponse.status}`)
    }
    const ports = await portsResponse.json()

    // Связываем ID порта с ID узла
    const portToNode = {}

    ports.forEach(port => {
      portToNode[port.id] = port.nodeId
    })

    // Загружаем группы
    const groupsResponse = await fetch("./api/groups/getGroups.php")

    if (!groupsResponse.ok) {
      throw new Error(`Ошибка загрузки Groups: HTTP ${groupsResponse.status}`)
    }
    const groups = await groupsResponse.json()

    // Загружаем линки
    const linksResponse = await fetch("./api/links/getLinks.php")

    if (!linksResponse.ok) {
      throw new Error(`Ошибка загрузки Links: HTTP ${linksResponse.status}`)
    }
    const links = await linksResponse.json()

    // Группируем порты по nodeId
    const portsByNode = {}

    ports.forEach(port => {

      if (!portsByNode[port.nodeId]) { portsByNode[port.nodeId] = [] }

      portsByNode[port.nodeId].push({
        id: String(port.id),
        name: port.name,
        portTypeId: port.portTypeId,
        label: port.label ?? "",
        note: port.note ?? ""
      })

    })

    // Добавляем порты к узлам
    nodes.forEach(node => {
      node.ports = portsByNode[node.id] ?? []
    })

    // Формируем модель GoJS
    const modelData = {

      class: "GraphLinksModel",

      nodeCategoryProperty: "type",

      linkFromPortIdProperty: "fromPort",
      linkToPortIdProperty: "toPort",

      nodeDataArray: [

        // Groups
        ...groups.map(group => ({
          key: `g${group.id}`,

          isGroup: true,

          type: group.category,

          text: group.name,

          groupTypeId: group.groupTypeId,

          icon: group.icon,

          ...(group.parentId !== null
            ? { group: `g${group.parentId}` }
            : {}),

          note: group.note
        })),

        // Nodes
        ...nodes.map(node => ({
          key: node.id,

          type: String(node.nodeTypeId),

          name: node.name,

          vendor: node.vendor,
          vendorId: node.vendorId,

          model: node.model,
          modelId: node.modelId,

          ...(node.groupId !== null
            ? { group: `g${node.groupId}` }
            : {}),

          ports: node.ports
        }))
      ],

      linkDataArray: links.map(link => ({
        key: link.id,

        from: portToNode[link.fromPort],
        to: portToNode[link.toPort],

        fromPort: String(link.fromPort),
        toPort: String(link.toPort),

        linkTypeId: link.linkTypeId,

        name: link.name ?? "",
        note: link.note ?? ""
      }))
    }

    // Подготовка визуального представления
    applyPresentation(
      modelData,
      portTypes,
      linkTypes
    )

    // Создаём модель GoJS
    diagram.model = go.Model.fromJson(modelData)

  } catch (err) {

    console.error(
      "Ошибка загрузки модели из БД:",
      err
    )

  }

}