import { createGroup } from "./createGroupTemplate.js"

export function registerGroupTemplates(diagram, groupTypes, contextMenu) {

  Object.values(groupTypes).forEach(group => {

    diagram.groupTemplateMap.add(

      group.category,

      createGroup(
        group.figure,
        group.fill,
        group.header,
        contextMenu,
        groupTypes
      )

    )

  })

}