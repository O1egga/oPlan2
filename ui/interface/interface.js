// Загружает HTML диалога оборудования
export async function loadEquipmentDialog() {

  const response = await fetch("./ui/interface/equipmentDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки equipmentDialog.html: ${response.status}`) }

  const html = await response.text()
  const dialogs = document.querySelector("#dialogs")

  if (!dialogs) { throw new Error("Не найден контейнер #dialogs") }

  dialogs.insertAdjacentHTML("beforeend", html)

}

// Загружает HTML диалога справочников
export async function loadReferenceDialog() {

  const response = await fetch("./ui/interface/referenceDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки referenceDialog.html: ${response.status}`) }

  const html = await response.text()
  const dialogs = document.querySelector("#dialogs")

  if (!dialogs) { throw new Error("Не найден контейнер #dialogs") }

  dialogs.insertAdjacentHTML("beforeend", html)
}

// Загружает HTML диалога настроек
export async function loadSettingsDialog() {

  const response = await fetch("./ui/interface/settingsDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки settingsDialog.html: ${response.status}`) }

  const html = await response.text()
  const dialogs = document.querySelector("#dialogs")

  if (!dialogs) { throw new Error("Не найден контейнер #dialogs") }

  dialogs.insertAdjacentHTML("beforeend", html)

}

// Инициализирует кнопку открытия справочников
export function initReferenceButton() {

  const button = document.querySelector("#referencesButton")
  const dialog = document.querySelector("#referenceDialog")

  if (!button) { throw new Error("Не найдена кнопка #referencesButton") }
  if (!dialog) { throw new Error("Не найден диалог #referenceDialog") }

  button.addEventListener("click", () => { dialog.showModal() })

}

// Инициализирует кнопку открытия настроек
export function initSettingsButton() {

  const button = document.querySelector("#settingsButton")
  const dialog = document.querySelector("#settingsDialog")
  const closeButton = document.querySelector("#settings-dialog-close")

  if (!button) { throw new Error("Не найдена кнопка #settingsButton") }
  if (!dialog) { throw new Error("Не найден диалог #settingsDialog") }
  if (!closeButton) { throw new Error("Не найдена кнопка #settings-dialog-close") }

  button.addEventListener("click", () => { dialog.showModal() })
  closeButton.addEventListener("click", () => { dialog.close() })

}

// Загружает HTML диалога дерева
export async function loadTreeDialog() {

  const response = await fetch("./ui/interface/treeDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки treeDialog.html: ${response.status}`) }

  const html = await response.text()
  const container = document.querySelector("#treeDialogContainer")

  if (!container) { throw new Error("Не найден контейнер #treeDialogContainer") }

  container.insertAdjacentHTML("beforeend", html)

}

export { initTreeDialog } from "../tree/treeDialog.js"

// Загружает HTML диалога подтверждения
export async function loadConfirmDialog() {

  const response = await fetch("./ui/interface/confirmDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки confirmDialog.html: ${response.status}`) }

  const html = await response.text()
  const dialogs = document.querySelector("#dialogs")

  if (!dialogs) { throw new Error("Не найден контейнер #dialogs") }

  dialogs.insertAdjacentHTML("beforeend", html)

}