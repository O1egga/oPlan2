oPlan2/
│
├── api/                    ← PHP / работа с БД
│   ├── models.php
│   ├── nodeTypes.php
│   ├── vendors.php
│   └── nodes/
│       └── create.php
│
├── core/                   ← логика приложения
│   ├── builders/
│   │   ├── node/
│   │   ├── port/
│   │   └── presentation/
│   │       ├── applyLinkStyle.js
│   │       ├── applyPortStyle.js
│   │       └── applyPresentation.js
│   │
│   ├── models/
│   │   └── loadGoModel.js
│   │
│   ├── styles/
│   │   ├── linkStyle.js
│   │   └── portStyle.js
│   │
│   └── utils/
│       └── settings.js
│
├── ui/                     ← интерфейс / GoJS
│   ├── diagram/
│   │   ├── createGroup.js
│   │   ├── createLink.js
│   │   ├── createNode.js
│   │   ├── createNodeBody.js
│   │   ├── createNodeToolbar.js
│   │   ├── createPort.js
│   │   ├── createPortArea.js
│   │   ├── groupTemplates.js
│   │   ├── linkTemplates.js
│   │   └── nodeTemplates.js
│   │
│   └── equipment/
│       ├── addPorts.js
│       ├── confirmDialog.js
│       ├── deleteAllPorts.js
│       ├── deletePorts.js
│       ├── equipmentContextMenu.js
│       ├── equipmentDialog.js
│       └── portUtils.js
│
├── data/
├── docs/
├── css/
└── pluginJsCss/