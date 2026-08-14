export function deleteSlot(button) {
  const slot = button.closest("article");

  if (!slot) return;

  slot.remove();
}