import { createLink } from "./createLinkTemplate.js"

// Регистрирует шаблон Link GoJS
export function registerLinkTemplates(diagram) {

  /*
  Функция просто создаёт шаблон через createLink() и назначает его диаграмме как основной linkTemplate.
  */

  diagram.linkTemplate = createLink();

}