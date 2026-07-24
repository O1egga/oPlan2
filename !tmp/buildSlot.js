// формирует список слотов узла из списка портов

export function buildSlots(node) {

  const slots = new Map()

  for (const port of node.ports) {

    let slot = slots.get(port.slotNo)

    if (!slot) {

      slot = {
        id: `${node.id}:${port.slotNo}`,   // уникальный id слота

        slotNo: port.slotNo,

        title: "",                         // позже можно заполнить

        ports: []
      }

      slots.set(port.slotNo, slot)
    }

    slot.ports.push(port)
  }

  // сортировка портов

  for (const slot of slots.values()) {

    slot.ports.sort((a, b) => a.portNo - b.portNo)

  }

  // сортировка слотов

  node.slots = [...slots.values()]
    .sort((a, b) => a.slotNo - b.slotNo)

}