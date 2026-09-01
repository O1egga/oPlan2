export function createReferenceSelector(
  title,
  data,
  onSelect = () => { },
  onAdd = () => { },
  onEdit = () => { },
  onDelete = () => { }
) {

  const container = document.createElement("div")

  container.className = "border"

  container.innerHTML = `

    <nav>
      <div class="field label prefix suffix">
        <i>search</i>
        <input type="text">
        <label>${title}</label>
        <i class="front reference-add">playlist_add</i>
      </div>
    </nav>

    <div class="right-align">
      <span id="countItem" class="large-padding"></span>
    </div>

    <div style="height: 400px; overflow-y: auto;">
      <ul class="list no-space"></ul>
    </div>
  `

  const input = container.querySelector("input")
  const addButton = container.querySelector(".reference-add")
  const list = container.querySelector("ul")
  const countItem = container.querySelector("#countItem")

  let items = [...data]
  let selected = null
  let addEnabled = true

  addButton.style.display = "none"


  // --------------------------------------------------
  // Отрисовка списка
  // --------------------------------------------------

  function renderList() {

    const search = input.value.trim().toLowerCase()

    const filteredItems = items.filter(item =>
      item.trim().toLowerCase().includes(search)
    )

    countItem.textContent = filteredItems.length

    list.innerHTML = filteredItems.map(item => `

      <li>
        <div class="max">${item}</div>
        <i class="tiny reference-edit">edit</i>
        <i class="tiny reference-delete">delete</i>
      </li>

    `).join("")

    list.querySelectorAll("li").forEach((li, index) => {

      const item = filteredItems[index]

      li.addEventListener("click", event => {

        if (event.target.closest(".reference-edit")) {
          onEdit(item)
          return
        }

        if (event.target.closest(".reference-delete")) {
          onDelete(item)
          return
        }

        selected = item
        input.value = selected

        updateAddButton()
        onSelect(selected)
        renderList()

      })

    })

  }


  // --------------------------------------------------
  // Кнопка Add
  // --------------------------------------------------

  function updateAddButton() {

    const value = input.value.trim()

    if (!value || !addEnabled) {
      addButton.style.display = "none"
      return
    }

    const exists = items.some(item =>
      item.trim().toLowerCase() === value.toLowerCase()
    )

    addButton.style.display =
      exists ? "none" : ""
  }

  function setAddEnabled(value) {

    addEnabled = value
    updateAddButton()
  }

  // --------------------------------------------------
  // Загрузка нового списка
  // --------------------------------------------------

  function load(newItems) {

    items = [...newItems]
    selected = null
    input.value = ""

    renderList()
    updateAddButton()
  }

  // --------------------------------------------------
  // Выбранное значение
  // --------------------------------------------------

  function getSelected() {
    return selected
  }


  // --------------------------------------------------
  // Проверка существования
  // --------------------------------------------------

  function hasValue(value, exceptValue = null) {

    const searchValue = value.trim().toLowerCase()

    return items.some(item => {

      if (item === exceptValue) {
        return false
      }

      return item.trim().toLowerCase() === searchValue

    })

  }


  // --------------------------------------------------
  // Переименование
  // --------------------------------------------------

  function rename(oldValue, newValue) {

    const index = items.indexOf(oldValue)

    if (index === -1) {
      return false
    }

    items[index] = newValue

    if (selected === oldValue) {
      selected = newValue
      input.value = newValue
    }

    renderList()
    updateAddButton()

    return true
  }


  // --------------------------------------------------
  // Добавление
  // --------------------------------------------------

  function add(value) {

    items.push(value)

    selected = value
    input.value = value

    renderList()
    updateAddButton()

    onSelect(value)
  }


  // --------------------------------------------------
  // Ввод текста
  // --------------------------------------------------

  input.addEventListener("input", () => {

    const value = input.value.trim()

    const existingItem = items.find(item =>
      item.trim().toLowerCase() === value.toLowerCase()
    )

    if (existingItem) {
      selected = existingItem
      onSelect(existingItem)
    } else {
      selected = null
      onSelect(null)
    }

    renderList()
    updateAddButton()

  })


  // --------------------------------------------------
  // Add
  // --------------------------------------------------

  addButton.addEventListener("click", () => {

    const value = input.value.trim()

    if (!value) {
      return
    }

    onAdd(value)

  })


  load(items)


  return {
    element: container,
    load,
    getSelected,
    hasValue,
    rename,
    add,
    setAddEnabled
  }

}