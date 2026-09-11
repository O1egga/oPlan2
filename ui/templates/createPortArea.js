import { createPort } from "./createPort.js"

// Создаёт область портов узла
export function createPortArea(portTypes) {

  /*
    Функция создаёт вертикальную панель и использует ports из данных узла как itemArray. Для каждого элемента массива применяется шаблон createPort(portTypes).
  */

  return new go.Panel("Vertical", { itemTemplate: createPort(portTypes) })
    .bind("itemArray", "ports")

}