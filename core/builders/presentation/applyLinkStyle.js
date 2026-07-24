import { getLinkStyle } from "../../styles/linkStyle.js";

export function applyLinkStyle(link) {

  link.style = {
    ...getLinkStyle(link.linkTypeId)
  }

}