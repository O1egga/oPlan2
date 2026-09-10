export async function loadTreeData() {

  const [groupsResponse, nodesResponse, nodeTypesResponse] = await Promise.all([
    fetch("./api/groups/getGroups.php"),
    fetch("./api/nodes/getNodes.php"),
    fetch("./api/getNodeTypes.php")
  ])

  if (!groupsResponse.ok) { throw new Error(`Ошибка загрузки getGroups.php: ${groupsResponse.status}`) }
  if (!nodesResponse.ok) { throw new Error(`Ошибка загрузки getNodes.php: ${nodesResponse.status}`) }
  if (!nodeTypesResponse.ok) { throw new Error(`Ошибка загрузки getNodeTypes.php: ${nodeTypesResponse.status}`) }

  const groups = await groupsResponse.json()
  const nodes = await nodesResponse.json()
  const nodeTypes = await nodeTypesResponse.json()

  // Создаём соответствие ID типа → название
  const nodeTypeMap = new Map(
    nodeTypes.map(type => [
      Number(type.id),
      type.name
    ])
  )

  const groupMap = new Map()

  groups.forEach(group => {

    groupMap.set(group.id, {
      title: group.name,
      key: `group-${group.id}`,
      expanded: false,
      data: group,
      children: []
    })

  })

  groups.forEach(group => {

    if (group.parentId === null) { return }

    const parent = groupMap.get(group.parentId)
    const current = groupMap.get(group.id)

    if (parent && current) { parent.children.push(current) }

  })

  // Оборудование без группы
  const ungrouped = {
    title: "_Без группы",
    key: "ungrouped",
    expanded: false,
    children: []
  }

  nodes.forEach(node => {

    // Определяем родительскую папку
    const group =
      node.groupId === null
        ? ungrouped
        : groupMap.get(node.groupId)

    if (!group) { return }

    // Формируем название оборудования: "Тип: имя"
    const nodeTypeName = nodeTypeMap.get(Number(node.nodeTypeId)) || "Other"

    group.children.push({
      title: `${nodeTypeName}: ${node.name}`,
      key: `node-${node.id}`,
      data: node
    })

  })

  const data = groups
    .filter(group => group.parentId === null)
    .map(group => groupMap.get(group.id))

  // Добавляем оборудование без группы
  if (ungrouped.children.length > 0) {
    data.push(ungrouped)
  }

  return data

}