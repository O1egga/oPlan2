# Project Structure

```text
oPlan2/
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── api/
│   ├── groups/
│   │   ├── createGroup.php
│   │   ├── deleteGroup.php
│   │   ├── getGroups.php
│   │   ├── updateName.php
│   │   └── updateParent.php
│   ├── links/
│   │   ├── createLink.php
│   │   ├── deleteLink.php
│   │   ├── getLinks.php
│   │   └── updateLink.php
│   ├── nodes/
│   │   ├── ports/
│   │   │   ├── createPorts.php
│   │   │   ├── deletePort.php
│   │   │   └── getPorts.php
│   │   ├── createNode.php
│   │   ├── deleteNode.php
│   │   ├── getNodes.php
│   │   ├── updateNode.php
│   │   └── updateNodeParent.php
│   ├── references/
│   │   ├── createModel.php
│   │   ├── createNodeType.php
│   │   ├── createVendor.php
│   │   ├── deleteModel.php
│   │   ├── deleteNodeType.php
│   │   ├── deleteVendor.php
│   │   ├── updateModel.php
│   │   ├── updateNodeType.php
│   │   └── updateVendor.php
│   ├── getGroupTypes.php
│   ├── getLinkTypes.php
│   ├── getModelsForForm.php
│   ├── getNodeTypes.php
│   ├── getNodeTypesForForm.php
│   ├── getPortTypes.php
│   ├── getReferences.php
│   └── getVendorsForForm.php
├── core/
│   ├── listeners/
│   │   ├── linkModelListener.js
│   │   │   └── registerLinkModelListener() // Регистрирует обработчики создания, изменения и удаления Link
│   │   └── nodeModelListener.js
│   │       ├── scheduleTreeRefresh() // Планирует обновление дерева после изменений
│   │       ├── waitForNodeDeletes() // Ожидаем завершения всех удалений
│   │       └── registerNodeModelListener() // Регистрирует обработчики перемещения и удаления оборудования
│   ├── models/
│   │   └── loadGoModel.js // Загружает данные из БД и формирует модель GoJS
│   │       └── loadModel()
│   ├── presentation/
│   │   ├── applyLinkStyle.js // Применяет стиль Link по его типу
│   │   │   └── applyLinkStyle() // Применяет стиль Link по его типу
│   │   ├── applyPortStyle.js // Применяет стиль Port по его типу
│   │   │   └── applyPortStyle() // Применяет стиль Port по его типу
│   │   └── applyPresentation.js
│   │       └── applyPresentation() // Применяет стили портов и Link к модели !ПРОВЕРИТЬ
│   ├── services/
│   │   ├── groupService.js // Обновляет родителя группы в БД !Проверить
│   │   │   ├── updateGroupParent() // Обновляет родителя группы в БД !Проверить
│   │   │   ├── deleteGroup() // Удаляет группу из БД
│   │   │   └── updateGroupName() // Обновляет название группы в БД
│   │   ├── linkService.js // Создаёт Link в БД
│   │   │   ├── createLink() // Создаёт Link в БД
│   │   │   ├── updateLink() // Обновляет Link в БД
│   │   │   └── deleteLink() // Удаляет Link из БД
│   │   └── nodeService.js // Обновляет родителя оборудования в БД
│   │       ├── updateNodeParent() // Обновляет родителя оборудования в БД
│   │       └── deleteNode() // Удаляет оборудование из БД
│   └── utils/
│       ├── --groupMoveValidation.js
│       │   └── canMoveGroup() // Проверка возможности перемещения группы
│       ├── configureDiagram.js // Настраивает параметры диаграммы
│       │   └── configureDiagram() // Настраивает параметры диаграммы
│       ├── displaySettings.js // Настройки отображения оборудования в localStorage
│       │   ├── getDisplaySettings() // Получает настройки отображения оборудования
│       │   └── saveDisplaySettings() // Сохраняет настройки отображения оборудования
│       ├── groupDeleteValidation.js // Проверяет, можно ли удалить группу !ПРОВЕРИТЬ
│       │   └── canDeleteGroup() // Проверяет, можно ли удалить группу !ПРОВЕРИТЬ
│       ├── groupPlacementValidation.js // Проверяет возможность размещения группы
│       │   └── canPlaceGroup() // Проверяет возможность размещения группы
│       └── updateLinkLabels.js // Обновляет подписи подключённых Link !ПРОВЕРИТЬ
│           ├── updateLinkLabels() // Обновляет подписи подключённых Link !ПРОВЕРИТЬ
│           └── getPortNumber() // Получает номер порта
├── css/
│   └── style.css
├── ui/
│   ├── equipment/
│   │   ├── addPorts.js
│   │   │   ├── createPortListItem() // Создаёт элемент списка портов
│   │   │   └── addPorts() // Добавляет новые порты выбранного типа
│   │   ├── confirmDialog.js // Показывает диалог подтверждения
│   │   │   └── showConfirmDialog() // Показывает диалог подтверждения
│   │   ├── deleteAllPorts.js
│   │   │   └── deleteAllPorts() // Удаляет все порты после проверки их использования
│   │   ├── deletePorts.js
│   │   │   └── deletePorts() // Удаляет выбранное количество портов указанного типа
│   │   ├── equipmentDialog.js
│   │   │   ├── initEquipmentDialog() // Инициализирует диалог оборудования
│   │   │   ├── openAddEquipmentDialog() // Открывает диалог для добавления оборудования
│   │   │   ├── checkEquipmentChanges() // Проверяет изменения оборудования и портов
│   │   │   ├── getCurrentPorts() // Получает текущее состояние портов из формы
│   │   │   └── openEquipmentDialog() // Открывает диалог редактирования оборудования
│   │   ├── equipmentDoubleClick.js
│   │   │   └── initEquipmentDoubleClick() // Регистрирует обработчик двойного клика по оборудованию
│   │   ├── equipmentForm.js // Инициализирует обработчики формы оборудования
│   │   │   ├── initEquipmentForm() // Инициализирует обработчики формы оборудования
│   │   │   ├── updateSaveButton() // Обновляет доступность кнопки сохранения
│   │   │   ├── loadVendors() // Загружает производителей для выбранного типа !ПРОВЕРИТЬ
│   │   │   ├── loadModels() // Загружает модели выбранного типа и производителя !ПРОВЕРИТЬ
│   │   │   ├── loadNodeTypes() // Загружает типы оборудования !ПРОВЕРИТЬ
│   │   │   └── fillEquipmentForm() // Заполняет форму данными оборудования
│   │   ├── equipmentPorts.js
│   │   │   ├── collectPorts() // Собирает данные портов из формы !ПРОВЕРИТЬ
│   │   │   ├── savePorts() // Сохраняет порты оборудования в БД
│   │   │   ├── loadPorts() // Загружает порты оборудования из БД
│   │   │   ├── fillPorts() // Заполняет список портов данными оборудования
│   │   │   ├── deletePorts() // Удаляет порты оборудования из БД
│   │   │   └── checkPorts() // Проверяет использование портов перед удалением
│   │   ├── equipmentSave.js
│   │   │   ├── saveEquipment() // Сохраняет новое оборудование и его порты
│   │   │   └── updateEquipment() // Обновляет оборудование и его порты !ПРОВЕРИТЬ
│   │   └── portUtils.js // Перенумеровывает порты выбранного типа
│   │       └── renumberPorts() // Перенумеровывает порты выбранного типа
│   ├── interface/
│   │   ├── confirmDialog.html
│   │   ├── confirmDialog.js // Показывает окно подтверждения !ПРОВЕРИТЬ
│   │   │   └── showConfirmDialog() // Показывает окно подтверждения !ПРОВЕРИТЬ
│   │   ├── equipmentDialog.html
│   │   ├── interface.js // Загружает HTML диалога оборудования
│   │   │   ├── loadEquipmentDialog() // Загружает HTML диалога оборудования
│   │   │   ├── loadReferenceDialog() // Загружает HTML диалога справочников
│   │   │   ├── loadSettingsDialog() // Загружает HTML диалога настроек
│   │   │   ├── initReferenceButton() // Инициализирует кнопку открытия справочников
│   │   │   ├── initSettingsButton() // Инициализирует кнопку открытия настроек
│   │   │   ├── loadTreeDialog() // Загружает HTML диалога дерева
│   │   │   └── loadConfirmDialog() // Загружает HTML диалога подтверждения
│   │   ├── referenceDialog.html
│   │   ├── referenceDialog.js
│   │   │   ├── initReferenceDialog() // Инициализирует диалог справочников
│   │   │   ├── getNodeType() // Находит тип оборудования по названию
│   │   │   ├── getVendor() // Находит производителя по названию
│   │   │   ├── getModel() // Находит модель по названию
│   │   │   ├── getModelsForSelection() // Формирует список моделей по выбранному типу и производителю !ПРОВЕРИТЬ
│   │   │   ├── updateSelectors() // Обновляет списки справочников и состояние выбора !ПРОВЕРИТЬ
│   │   │   ├── addReference() // Добавляет новую модель и связанные тип и производителя !ПРОВЕРИТЬ
│   │   │   ├── renameReference() // Переименовывает элемент справочника !ПРОВЕРИТЬ
│   │   │   ├── deleteReference() // Удаляет модель и обновляет связанные данные в памяти !ПРОВЕРИТЬ
│   │   │   └── editReference() // Открывает диалог редактирования справочника
│   │   ├── referenceSelector.js // Создаёт селектор справочника
│   │   │   ├── createReferenceSelector() // Создаёт селектор справочника
│   │   │   ├── renderList() // Отображает отфильтрованный список элементов
│   │   │   ├── updateLeftButton() // Обновляет иконку кнопки добавления
│   │   │   ├── updateClearButton() // Обновляет иконку кнопки поиска и очистки
│   │   │   ├── setAddEnabled() // Управляет доступностью добавления элемента
│   │   │   ├── load() // Загружает новый список элементов
│   │   │   ├── getSelected() // Возвращает выбранный элемент
│   │   │   ├── setSelected() // Устанавливает выбранный элемент
│   │   │   ├── hasValue() // Проверяет наличие значения в списке
│   │   │   ├── setInputValue() // Устанавливает значение поля ввода
│   │   │   ├── getInputValue() // Возвращает значение поля ввода
│   │   │   ├── rename() // Переименовывает элемент в локальном списке
│   │   │   └── add() // Добавляет элемент в локальный список
│   │   ├── settingsDialog.html
│   │   ├── settingsDialog.js
│   │   │   └── initSettingsDialog() // Инициализирует настройки отображения оборудования
│   │   └── treeDialog.html
│   ├── templates/
│   │   ├── createGroupTemplate.js // Создаёт шаблон группы GoJS
│   │   │   └── createGroup() // Создаёт шаблон группы GoJS
│   │   ├── createLinkTemplate.js // Создаёт шаблон Link GoJS
│   │   │   ├── createLink() // Создаёт шаблон Link GoJS
│   │   │   └── createLinkLabel() // Создаёт подпись Link
│   │   ├── createNodeBody.js
│   │   │   └── createNodeBody() // Создаёт основную область узла !ПРОВЕРИТЬ
│   │   ├── createNodeTemplate.js
│   │   │   └── createNode() // Создаёт шаблон узла оборудования GoJS
│   │   ├── createNodeToolbar.js
│   │   │   ├── createNodeToolbar() // Создаёт панель кнопок узла
│   │   │   └── createToolbarButton() // Создаёт кнопку панели
│   │   ├── createPort.js // Создаёт шаблон порта GoJS
│   │   │   └── createPort() // Создаёт шаблон порта GoJS
│   │   ├── createPortArea.js
│   │   │   └── createPortArea() // Создаёт область портов узла
│   │   ├── registerGroupTemplates.js
│   │   │   └── registerGroupTemplates() // Регистрирует шаблоны групп GoJS
│   │   ├── registerLinkTemplates.js
│   │   │   └── registerLinkTemplates() // Регистрирует шаблон Link GoJS
│   │   └── registerNodeTemplates.js
│   │       └── registerNodeTemplates() // Регистрирует шаблоны узлов GoJS
│   └── tree/
│       ├── applyVisibility.js // Применяет видимость элементов GoJS по выбору в Wunderbaum
│       │   └── applyVisibility() // Применяет видимость элементов GoJS по выбору в Wunderbaum
│       ├── treeContextMenu.js
│       │   ├── initTreeContextMenu() // Инициализирует контекстное меню дерева
│       │   ├── createGroup() // Создаёт группу через API !ПРОВЕРИТЬ
│       │   ├── deleteGroup() // Удаляет группу через API !ПРОВЕРИТЬ
│       │   ├── renameGroup() // Переименовывает группу через API !ПРОВЕРИТЬ
│       │   └── getMenuItems() // Формирует пункты контекстного меню для узла дерева
│       ├── treeData.js // Загружает данные групп и оборудования для дерева
│       │   └── loadTreeData() // Загружает данные групп и оборудования для дерева
│       ├── treeDialog.css
│       ├── treeDialog.js
│       │   ├── initTreeDialog() // Инициализирует диалог и дерево Wunderbaum
│       │   ├── refreshTree() // Обновляет дерево из БД с сохранением состояния
│       │   └── closeTreeDialog() // Закрывает диалог с анимацией
│       └── treeExpandSync.js // Создаёт обработчик раскрытия Wunderbaum → GoJS
│           ├── createTreeExpandHandler() // Создаёт обработчик раскрытия Wunderbaum → GoJS
│           └── initDiagramExpandSync() // Синхронизирует раскрытие групп GoJS с Wunderbaum
├── index.html
├── main.js
│   ├── loadNodeTypes() // получить типы узлов
│   ├── loadPortTypes() // получить типы портов
│   ├── loadLinkTypes() // получить типы линков
│   ├── loadGroupTypes() // получить типы групп
│   └── refreshDiagram() // Обновление схемы из БД
├── oPlan2.zip
└── project-structure_Mycomment.md
```
