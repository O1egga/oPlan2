import { createGroup } from "./createGroupTemplate.js"

// Регистрирует шаблоны групп GoJS
export function registerGroupTemplates(diagram, groupTypes) {

  /*  
   Функция проходит по всем groupTypes и для каждого типа регистрирует шаблон в diagram.groupTemplateMap по его id.
   */

  Object.values(groupTypes).forEach(groupType => {

    diagram.groupTemplateMap.add(

      String(groupType.id),

      createGroup(
        groupType.figure,
        groupType.fill,
        groupType.header
      )

    )

  })

}