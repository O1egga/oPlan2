import { applyPortStyle } from "./applyPortStyle.js"
import { applyLinkStyle } from "./applyLinkStyle.js"

// Применяет стили портов и Link к модели !ПРОВЕРИТЬ
export function applyPresentation(model, portTypes, linkTypes) {

  /*
  после аудита нужно будет посмотреть, где вызывается applyPresentation() и действительно ли она нужна как отдельный слой.
  */

  model.nodeDataArray.forEach(node => {

    if (!node.ports) { return }

    node.ports.forEach(port => {

      applyPortStyle(port, portTypes)

    })

  })

  model.linkDataArray?.forEach(link => {
    applyLinkStyle(link, linkTypes)
  })

}