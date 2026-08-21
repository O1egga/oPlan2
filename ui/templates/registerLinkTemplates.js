import { createLink } from "./createLinkTemplate.js";

export function registerLinkTemplates(diagram) {

  diagram.linkTemplate = createLink();

}