// Применяет стиль Link по его типу
export function applyLinkStyle(link, linkTypes) {

  link.style = {
    ...linkTypes[link.linkTypeId]
  }

}