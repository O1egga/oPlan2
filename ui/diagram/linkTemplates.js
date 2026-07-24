import { createLink } from "./createLink.js";

export function registerLinkTemplates(diagram) {

  diagram.linkTemplate = createLink();

}