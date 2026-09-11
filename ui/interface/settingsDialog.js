import { getDisplaySettings, saveDisplaySettings } from "../../core/utils/displaySettings.js"

// Инициализирует настройки отображения оборудования
export function initSettingsDialog(myDiagram) {

  const vendorModelCheckbox = document.querySelector("#showVendorModel")

  const nameCheckbox = document.querySelector("#showEquipmentName")

  if (!vendorModelCheckbox) { throw new Error("Не найден #showVendorModel") }

  if (!nameCheckbox) { throw new Error("Не найден #showEquipmentName") }

  const settings = getDisplaySettings()

  vendorModelCheckbox.checked = settings.showVendorModel

  nameCheckbox.checked = settings.showName

  vendorModelCheckbox.addEventListener("change", () => {

    settings.showVendorModel = vendorModelCheckbox.checked

    saveDisplaySettings(settings)

    myDiagram.nodes.each(node => {

      const textBlock = node.findObject("VendorModel")

      if (textBlock) { textBlock.visible = settings.showVendorModel }
    })
  })

  nameCheckbox.addEventListener("change", () => {

    settings.showName = nameCheckbox.checked

    saveDisplaySettings(settings)

    myDiagram.nodes.each(node => {

      const textBlock = node.findObject("EquipmentName")
      if (textBlock) { textBlock.visible = settings.showName }
    })
  })
}