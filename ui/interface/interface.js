export async function loadEquipmentDialog() {

  const response = await fetch("./ui/interface/equipmentDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки equipmentDialog.html: ${response.status}`) }

  const html = await response.text()
  const dialogs = document.querySelector("#dialogs")

  if (!dialogs) { throw new Error("Не найден контейнер #dialogs") }

  dialogs.insertAdjacentHTML("beforeend", html)

}

export async function loadGroupDialog() {

  const response = await fetch("./ui/interface/groupDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки groupDialog.html: ${response.status}`) }

  const html = await response.text()
  const dialogs = document.querySelector("#dialogs")

  if (!dialogs) { throw new Error("Не найден контейнер #dialogs") }

  dialogs.insertAdjacentHTML("beforeend", html)

}

export async function loadReferenceDialog() {

  const response = await fetch("./ui/interface/referenceDialog.html")

  if (!response.ok) { throw new Error(`Ошибка загрузки referenceDialog.html: ${response.status}`) }

  const html = await response.text()
  const dialogs = document.querySelector("#dialogs")

  if (!dialogs) { throw new Error("Не найден контейнер #dialogs") }

  dialogs.insertAdjacentHTML("beforeend", html)

  await loadScript("./pluginJsCss/virtual-select.min.js")

  VirtualSelect.init({
    ele: "#testSelect",
    enableSecureText: true,
    options: [
      { label: "NodeTypes", value: "1" },
      { label: "PortTypes", value: "2" },
      { label: "LinkTypes", value: "3" }
    ]
  })
}

function loadScript(src) {

  return new Promise((resolve, reject) => {

    const script = document.createElement("script")
    script.src = src
    script.onload = resolve
    script.onerror = () => reject(new Error(`Ошибка загрузки ${src}`))

    document.head.append(script)

  })

}

export function initReferenceButton() {

  const button = document.querySelector("#referencesButton")
  const dialog = document.querySelector("#referenceDialog")

  if (!button) { throw new Error("Не найдена кнопка #referencesButton") }
  if (!dialog) { throw new Error("Не найден диалог #referenceDialog") }

  button.addEventListener("click", () => { dialog.showModal() })

}