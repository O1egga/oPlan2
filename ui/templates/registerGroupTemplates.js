import { createGroup } from "./createGroupTemplate.js"

export function registerGroupTemplates(diagram, groupTypes, contextMenu) {

  Object.values(groupTypes).forEach(groupType => {

    diagram.groupTemplateMap.add(

      String(groupType.id),

      createGroup(
        groupType.figure,
        groupType.fill,
        groupType.header,
        contextMenu,
        groupTypes
      )

    )

  })

}