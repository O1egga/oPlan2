---
config:
  layout: fixed
---
flowchart LR
    settings["settings.js"] --> main["main.js"]
    nodeTemplates["nodeTemplates.js"] --> main
    linkTemplates["linkTemplates.js"] --> main
    groupTemplates["groupTemplates.js"] --> main
    loadGoModel["loadGoModel.js"] --> main
    customFigures["customFigures.js"] --> main
    createNode["createNode.js"] --> nodeTemplates
    createNodeBody["createNodeBody.js"] --> createNode
    createNodeToolbar["createNodeToolbar.js"] --> createNodeBody
    createSlotArea["createSlotArea.js"] --> createNodeBody
    createSlot["createSlot.js"] --> createSlotArea
    createPort["createPort.js"] --> createSlot
    createLink["createLink.js"] --> linkTemplates
    createGroup["createGroup.js"] --> groupTemplates
    applyPresentation["applyPresentation.js"] --> loadGoModel
    applyPortStyle["applyPortStyle.js"] --> applyPresentation
    portStyle["portStyle.js"] --> applyPortStyle
    applyLinkStyle["applyLinkStyle.js"] --> applyPresentation
    'linkStyle'["linkStyle.js"] --> applyLinkStyle