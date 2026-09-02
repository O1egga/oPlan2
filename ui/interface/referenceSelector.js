export function createReferenceSelector(
  title,
  data,
  {
    onSelect = () => { },
    onInput = () => { },
    onAdd = null,
    onEdit = null,
    onDelete = null,
    colorField = null,
    leftIcon = "filter_list"
  } = {}
) {

  const container = document.createElement("div")

  container.className = "border"

  container.innerHTML = `

    <nav>
      <div class="field label prefix suffix">
        <i class="front reference-left">${leftIcon}</i>
        <input type="text">
        <label>${title}</label>
        <i class="front reference-clear">search</i>
      </div>
    </nav>

    <div class="right-align">
      <span class="large-padding count-item">0</span>
    </div>

    <div style="height: 400px; overflow-y: auto;">
      <ul class="list no-space"></ul>
    </div>
  `

  const input = container.querySelector("input")
  const leftButton = container.querySelector(".reference-left")
  const clearButton = container.querySelector(".reference-clear")
  const list = container.querySelector("ul")
  const countItem = container.querySelector(".count-item")

  let items = [...data]
  let selected = null
  let addEnabled = true

  // --------------------------------------------------
  // Список
  // --------------------------------------------------

  function renderList() {

    const search =
      input.value.trim().toLowerCase()

    const filteredItems =
      items.filter(item =>
        item.name.trim().toLowerCase().includes(search)
      )

    countItem.textContent =
      filteredItems.length

    list.innerHTML =
      filteredItems.map(item => `
        <li>
          <div class="round" style="${colorField && item[colorField] ? `background:${item[colorField]}; padding:0px 10px 0px;` : ""}">${item.name}</div>
          <div class="max"></div>
          ${onEdit ? '<i class="tiny reference-edit">edit</i>' : ""}
          ${onDelete ? '<i class="tiny reference-delete">delete</i>' : ""}
        </li>
      `).join("")


    list.querySelectorAll("li").forEach(
      (li, index) => {

        const item = filteredItems[index]

        li.addEventListener("click", event => {

          if (
            onEdit &&
            event.target.closest(".reference-edit")
          ) {
            onEdit(item)
            return
          }

          if (
            onDelete &&
            event.target.closest(".reference-delete")
          ) {
            onDelete(item)
            return
          }

          selected = item
          input.value = selected.name

          onSelect(selected)
          renderList()
        })
      }
    )
    updateClearButton()
    updateLeftButton()
  }


  // --------------------------------------------------
  // Update left button
  // --------------------------------------------------

  function updateLeftButton() {

    if (!onAdd) {
      leftButton.textContent = "filter_list"
      return
    }

    const value = input.value.trim()

    if (!value || !addEnabled) {
      leftButton.textContent = "filter_list"
      return
    }

    const exists = items.some(item =>
      item.name.trim().toLowerCase() ===
      value.toLowerCase()
    )

    leftButton.textContent =
      exists ? "filter_list" : "playlist_add"
  }


  // --------------------------------------------------
  // Clear button X/search
  // --------------------------------------------------

  function updateClearButton() {

    clearButton.textContent =
      input.value.trim() ? "close" : "search"
  }

  // --------------------------------------------------
  // Add enabled
  // --------------------------------------------------

  function setAddEnabled(value) {

    addEnabled = value
    updateLeftButton()
  }


  // --------------------------------------------------
  // Load
  // --------------------------------------------------

  function load(newItems) {

    items = [...newItems]

    renderList()
  }


  // --------------------------------------------------
  // Selected
  // --------------------------------------------------

  function getSelected() {
    return selected
  }

  function setSelected(value) {

    selected = value
    input.value = value ? value.name : ""

    renderList()
  }


  // --------------------------------------------------
  // Проверка значения
  // --------------------------------------------------

  function hasValue(
    value,
    exceptValue = null
  ) {

    const searchValue =
      value.trim().toLowerCase()

    return items.some(item => {

      if (
        exceptValue &&
        item.id === exceptValue.id
      ) {
        return false
      }

      return item.name.trim().toLowerCase() ===
        searchValue
    })
  }


  function setInputValue(value) {
    input.value = value || ""

    renderList()
  }

  function getInputValue() {
    return input.value
  }

  // --------------------------------------------------
  // Rename
  // --------------------------------------------------

  function rename(
    oldValue,
    newValue
  ) {
    const index =
      items.findIndex(item =>
        item.id === oldValue.id
      )

    if (index === -1) {
      return false
    }

    const renamedValue = {
      ...oldValue,
      name: newValue
    }

    items[index] = renamedValue

    if (
      selected &&
      selected.id === oldValue.id
    ) {
      selected = renamedValue
      input.value = renamedValue.name
    }

    renderList()

    return true
  }


  // --------------------------------------------------
  // Add item
  // --------------------------------------------------

  function add(value) {

    items.push(value)

    selected = value
    input.value = value.name

    renderList()
  }


  // --------------------------------------------------
  // Search / Input
  // --------------------------------------------------

  input.addEventListener("input", () => {

    const value =
      input.value.trim()

    const match =
      items.find(item =>
        item.name.trim().toLowerCase() ===
        value.toLowerCase()
      ) || null

    onInput(value, match)

    renderList()
  })


  // --------------------------------------------------
  // Clear button
  // --------------------------------------------------

  clearButton.addEventListener("click", () => {

    if (!input.value.trim()) {
      return
    }

    input.value = ""
    selected = null

    onInput("", null)

    renderList()
  })

  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  leftButton.addEventListener("click", () => {

    if (!onAdd) {
      return
    }

    const value =
      input.value.trim()

    if (!value || !addEnabled) {
      return
    }

    const exists = items.some(item =>
      item.name.trim().toLowerCase() ===
      value.toLowerCase()
    )

    if (exists) {
      return
    }
    onAdd(value)
  })


  load(items)


  return {
    element: container,
    load,
    getSelected,
    setSelected,
    setInputValue,
    getInputValue,
    hasValue,
    rename,
    add,
    setAddEnabled
  }
}