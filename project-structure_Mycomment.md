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
│   │   │   └── registerLinkModelListener()
│   │   └── nodeModelListener.js
│   │       ├── scheduleTreeRefresh()
│   │       ├── waitForNodeDeletes() // Ожидаем завершения всех удалений
│   │       └── registerNodeModelListener()
│   ├── models/
│   │   └── loadGoModel.js // загрузка модели
│   │       └── loadModel()
│   ├── presentation/
│   │   ├── applyLinkStyle.js
│   │   │   └── applyLinkStyle()
│   │   ├── applyPortStyle.js
│   │   │   └── applyPortStyle()
│   │   └── applyPresentation.js
│   │       └── applyPresentation()
│   ├── services/
│   │   ├── groupService.js // Обновляем родителя группы в БД
│   │   │   ├── updateGroupParent() // Обновляем родителя группы в БД
│   │   │   ├── deleteGroup() // Удаляем группу из БД
│   │   │   └── updateGroupName() // Обновляем название группы в БД
│   │   ├── linkService.js
│   │   │   ├── createLink()
│   │   │   ├── updateLink()
│   │   │   └── deleteLink()
│   │   └── nodeService.js // Обновляем родителя оборудования в БД
│   │       ├── updateNodeParent() // Обновляем родителя оборудования в БД
│   │       └── deleteNode() // Удаляем оборудование из БД
│   └── utils/
│       ├── --groupMoveValidation.js
│       │   └── canMoveGroup() // Проверка возможности перемещения группы
│       ├── configureDiagram.js // Настройки диаграммы
│       │   └── configureDiagram()
│       ├── displaySettings.js // localstorage
│       │   ├── getDisplaySettings()
│       │   └── saveDisplaySettings()
│       ├── groupDeleteValidation.js // Проверяет, можно ли удалить группу
│       │   └── canDeleteGroup() // Проверяет, можно ли удалить группу
│       ├── groupPlacementValidation.js
│       │   └── canPlaceGroup()
│       └── updateLinkLabels.js
│           ├── updateLinkLabels()
│           └── getPortNumber()
├── css/
│   └── style.css
├── ui/
│   ├── equipment/
│   │   ├── addPorts.js
│   │   │   ├── createPortListItem() // Создаёт один порт в списке
│   │   │   └── addPorts() // Добавляет порты
│   │   ├── confirmDialog.js
│   │   │   └── showConfirmDialog()
│   │   ├── deleteAllPorts.js
│   │   │   └── deleteAllPorts()
│   │   ├── deletePorts.js
│   │   │   └── deletePorts()
│   │   ├── equipmentDialog.js
│   │   │   ├── initEquipmentDialog()
│   │   │   ├── openAddEquipmentDialog() // Открывает диалог для добавления оборудования
│   │   │   ├── checkEquipmentChanges()
│   │   │   ├── getCurrentPorts()
│   │   │   └── openEquipmentDialog()
│   │   ├── equipmentDoubleClick.js
│   │   │   └── initEquipmentDoubleClick()
│   │   ├── equipmentForm.js
│   │   │   ├── initEquipmentForm()
│   │   │   ├── updateSaveButton()
│   │   │   ├── loadVendors()
│   │   │   ├── loadModels()
│   │   │   ├── loadNodeTypes()
│   │   │   └── fillEquipmentForm()
│   │   ├── equipmentPorts.js
│   │   │   ├── collectPorts()
│   │   │   ├── savePorts()
│   │   │   ├── loadPorts()
│   │   │   ├── fillPorts()
│   │   │   ├── deletePorts()
│   │   │   └── checkPorts()
│   │   ├── equipmentSave.js
│   │   │   ├── saveEquipment() // Сохраняет новое оборудование в указанную группу
│   │   │   └── updateEquipment() // Обновляем оборудование в БД
│   │   └── portUtils.js
│   │       └── renumberPorts()
│   ├── interface/
│   │   ├── confirmDialog.html
│   │   ├── confirmDialog.js // Показывает окно подтверждения
│   │   │   └── showConfirmDialog() // Показывает окно подтверждения
│   │   ├── equipmentDialog.html
│   │   ├── interface.js
│   │   │   ├── loadEquipmentDialog()
│   │   │   ├── loadReferenceDialog()
│   │   │   ├── loadSettingsDialog()
│   │   │   ├── initReferenceButton()
│   │   │   ├── initSettingsButton()
│   │   │   ├── loadTreeDialog()
│   │   │   └── loadConfirmDialog()
│   │   ├── referenceDialog.html
│   │   ├── referenceDialog.js
│   │   │   ├── initReferenceDialog()
│   │   │   ├── getNodeType() // -------------------------------------------------- Поиск объектов
│   │   │   ├── getVendor()
│   │   │   ├── getModel()
│   │   │   ├── getModelsForSelection() // -------------------------------------------------- Модели для текущего выбора
│   │   │   ├── updateSelectors() // -------------------------------------------------- Обновление списков
│   │   │   ├── addReference() // -------------------------------------------------- Add
│   │   │   ├── renameReference() // -------------------------------------------------- Rename
│   │   │   ├── deleteReference() // -------------------------------------------------- Delete
│   │   │   └── editReference() // -------------------------------------------------- Редактирование
│   │   ├── referenceSelector.js
│   │   │   ├── createReferenceSelector()
│   │   │   ├── renderList() // -------------------------------------------------- Список
│   │   │   ├── updateLeftButton() // -------------------------------------------------- Update left button
│   │   │   ├── updateClearButton() // -------------------------------------------------- Clear button X/search
│   │   │   ├── setAddEnabled() // -------------------------------------------------- Add enabled
│   │   │   ├── load() // -------------------------------------------------- Load
│   │   │   ├── getSelected() // -------------------------------------------------- Selected
│   │   │   ├── setSelected()
│   │   │   ├── hasValue() // -------------------------------------------------- Проверка значения
│   │   │   ├── setInputValue()
│   │   │   ├── getInputValue()
│   │   │   ├── rename() // -------------------------------------------------- Rename
│   │   │   └── add() // -------------------------------------------------- Add item
│   │   ├── settingsDialog.html
│   │   ├── settingsDialog.js
│   │   │   └── initSettingsDialog()
│   │   └── treeDialog.html
│   ├── templates/
│   │   ├── createGroupTemplate.js
│   │   │   └── createGroup()
│   │   ├── createLinkTemplate.js
│   │   │   ├── createLink()
│   │   │   └── createLinkLabel()
│   │   ├── createNodeBody.js // создание основной области узла
│   │   │   └── createNodeBody()
│   │   ├── createNodeTemplate.js
│   │   │   └── createNode()
│   │   ├── createNodeToolbar.js
│   │   │   ├── createNodeToolbar()
│   │   │   └── createToolbarButton()
│   │   ├── createPort.js
│   │   │   └── createPort()
│   │   ├── createPortArea.js
│   │   │   └── createPortArea()
│   │   ├── registerGroupTemplates.js
│   │   │   └── registerGroupTemplates()
│   │   ├── registerLinkTemplates.js
│   │   │   └── registerLinkTemplates()
│   │   └── registerNodeTemplates.js // все шаблоны узлов
│   │       └── registerNodeTemplates()
│   └── tree/
│       ├── applyVisibility.js // Применяет выбранные элементы Wunderbaum к видимости GoJS
│       │   └── applyVisibility() // Применяет выбранные элементы Wunderbaum к видимости GoJS
│       ├── treeContextMenu.js
│       │   ├── initTreeContextMenu() // Контекстное меню дерева
│       │   ├── createGroup()
│       │   ├── deleteGroup()
│       │   ├── renameGroup()
│       │   └── getMenuItems()
│       ├── treeData.js
│       │   └── loadTreeData()
│       ├── treeDialog.css
│       ├── treeDialog.js
│       │   ├── initTreeDialog()
│       │   ├── refreshTree()
│       │   └── closeTreeDialog() // Синхронизация раскрытия
│       └── treeExpandSync.js // Создаёт обработчик раскрытия Wunderbaum → GoJS
│           ├── createTreeExpandHandler() // Создаёт обработчик раскрытия Wunderbaum → GoJS
│           └── initDiagramExpandSync() // GoJS → Wunderbaum
├── index.html
└── main.js
    ├── loadNodeTypes()
    ├── loadPortTypes()
    ├── loadLinkTypes()
    ├── loadGroupTypes()
    └── refreshDiagram()
```
