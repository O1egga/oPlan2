import { createGroup } from "./createGroup.js"

export function registerGroupTemplates(diagram, groupTypes) {

  Object.values(groupTypes).forEach(group => {

    diagram.groupTemplateMap.add(

      group.category,

      createGroup(
        group.figure,
        group.fill,
        group.header
      )

    )

  })

}