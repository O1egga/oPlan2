import { createLink, updateLink, deleteLink } from "../services/linkService.js"
import { updateLinkLabels } from "../utils/updateLinkLabels.js"

export function registerLinkModelListener(
  diagram,
  portTypes,
  linkTypes,
  nodeTypes
) {

  // =====================================================
  // Создание Link
  // =====================================================

  diagram.addDiagramListener("LinkDrawn", event => {

    const link = event.subject

    if (!(link instanceof go.Link)) {
      return
    }

    const fromPort = link.fromPort

    if (!fromPort) {
      return
    }

    const portTypeId = fromPort.data.portTypeId
    const portType = portTypes[portTypeId]

    if (!portType) {

      console.error(
        "Не найден PortType:",
        portTypeId
      )

      return
    }

    const linkTypeId = portType.linkTypeId

    diagram.model.setDataProperty(
      link.data,
      "linkTypeId",
      linkTypeId
    )

    diagram.model.setDataProperty(
      link.data,
      "style",
      {
        ...linkTypes[linkTypeId]
      }
    )

    createLink(link.data)
      .then(id => {

        diagram.model.setDataProperty(
          link.data,
          "key",
          id
        )

        console.log(
          "Link сохранён в БД:",
          id
        )

      })
      .catch(error => {

        console.error(
          "Ошибка сохранения Link:",
          error
        )

      })

  })


  // =====================================================
  // Переподключение Link
  // =====================================================

  diagram.addDiagramListener("LinkRelinked", event => {

    const link = event.subject

    if (!(link instanceof go.Link)) {
      return
    }

    if (!link.data) {
      return
    }

    console.log(
      "ПЕРЕПОДКЛЮЧЕНИЕ LINK:",
      link.data
    )

    updateLink(link.data)
      .then(() => {

        console.log(
          "Link обновлён в БД:",
          link.data.key
        )

        const fromNode = link.fromNode
        const toNode = link.toNode


        if (
          fromNode &&
          fromNode.data.showLinkLabels === true
        ) {

          const nodeType =
            nodeTypes[fromNode.data.nodeTypeId]

          if (nodeType) {

            updateLinkLabels(
              fromNode,
              true,
              nodeType.name
            )
          }

        }


        if (
          toNode &&
          toNode.data.showLinkLabels === true
        ) {

          const nodeType =
            nodeTypes[toNode.data.nodeTypeId]

          if (nodeType) {

            updateLinkLabels(
              fromNode,
              true,
              nodeType.name
            )
          }

        }

      })
      .catch(error => {

        console.error(
          "Ошибка обновления Link в БД:",
          error
        )

      })

  })

  // =====================================================
  // Удаление Link
  // =====================================================

  diagram.model.addChangedListener(event => {

    if (
      event.modelChange !== "linkDataArray" ||
      event.change !== go.ChangeType.Remove
    ) {
      return
    }

    const link = event.oldValue

    if (!link) {
      return
    }

    const linkId = Number(link.key)

    if (!linkId) {
      return
    }

    console.log(
      "Удаляем Link из БД:",
      linkId
    )

    deleteLink(linkId)
      .catch(error => {

        console.error(
          "Ошибка удаления Link из БД:",
          error
        )

      })

  })

}