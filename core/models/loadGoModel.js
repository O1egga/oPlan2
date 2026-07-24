// загрузка модели
import { applyPresentation } from "../builders/presentation/applyPresentation.js";

export async function loadModel(diagram, url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    // подготовка данных для отображения

    applyPresentation(json);

    diagram.model = go.Model.fromJson(json);
  } catch (err) {
    console.error("Ошибка загрузки модели:", err);
  }
}
