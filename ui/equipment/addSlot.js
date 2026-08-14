export function addSlot(button) {

  const dialog = button.closest("dialog");

  const slotCount = dialog.querySelectorAll("article").length + 1;

  const article = document.createElement("article");

  article.className = "border";

  article.innerHTML = `
    <nav>
      <strong class="max">Слот ${slotCount}</strong>

      <button class="square small error delete-slot">
        <i>delete</i>
      </button>
    </nav>

    <hr class="medium">

    <ul class="list no-space ports">
    </ul>

    <!-- добавить порты -->
    <nav>
      <div class="max"></div>
      <button class="fill">
        <span>Добавить порты</span>

      </button>
      <menu class="top no-wrap">
        <li>

          <div class="row padding">
            <div class="field small border">
              <select class="port-count">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </select>
            </div>

            <div class="field small border label">
              <select class="port-type">
                <option>Radio</option>
                <option>Coaxial</option>
                <option>Cross</option>
                <option>Ethernet</option>
                <option>Optical</option>
                <option>SFP-Eth</option>
                <option>SFP-Opt</option>
                <option>Other</option>
              </select>
              <label>тип</label>
            </div>

            <button class="square fill add-ports">
              <i>add</i>
            </button>
          </div>

        </li>
      </menu>
    </nav>

  `;

  button.parentElement.before(article);
}