// Обновляет подписи подключённых Link !ПРОВЕРИТЬ
export function updateLinkLabels(node, show, title) {
  /*
  : функция принимает один node и один title, а затем обновляет подписи как исходящих, так и входящих Link.
Особенно важно сравнить это с linkModelListener.js, который мы уже видели. Там при LinkRelinked есть подозрительный вызов:
  */

  const diagram = node.diagram

  if (!diagram) { return }

  node.findLinksConnected().each(link => {

    const data = link.data

    if (!data) { return }

    // Link идёт ОТ этого оборудования
    if (String(data.from) === String(node.data.key)) {

      const label = link.findObject("FROM_LABEL")
      if (!label) { return }

      const text = label.findObject("LABEL_TEXT")
      if (!text) { return }

      const targetNode = diagram.findNodeForKey(data.to)
      if (!targetNode) { return }

      const targetPort = targetNode.findPort(String(data.toPort))
      if (!targetPort) { return }

      text.text = `> ${title} ${targetNode.data.name || ""} : ${getPortNumber(targetPort)}`

      label.visible = show

    }

    // Link идёт К этому оборудованию
    if (String(data.to) === String(node.data.key)) {

      const label = link.findObject("TO_LABEL")
      if (!label) { return }

      const text = label.findObject("LABEL_TEXT")
      if (!text) { return }

      const sourceNode = diagram.findNodeForKey(data.from)
      if (!sourceNode) { return }

      const sourcePort = sourceNode.findPort(String(data.fromPort))
      if (!sourcePort) { return }

      text.text = `> ${title} ${sourceNode.data.name || ""} : ${getPortNumber(sourcePort)}`

      label.visible = show

    }

  })

}

// Получает номер порта
function getPortNumber(port) {

  if (!port || !port.data) { return "" }
  return port.data.name ?? ""

}