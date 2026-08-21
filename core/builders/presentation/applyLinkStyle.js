export function applyLinkStyle(link, linkTypes) {

  link.style = {
    ...linkTypes[link.linkTypeId]
  }

}