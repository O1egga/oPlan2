import {
  createLink,
  deleteLink
} from "../services/linkService.js"


export function registerLinkModelListener(
  diagram,
  portTypes,
  linkTypes
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