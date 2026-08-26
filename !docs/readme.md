Резюме проекта oPlan
Общая идея проекта

oPlan — это система управления телекоммуникационной сетью с единой базой данных и несколькими способами отображения информации.

Одни и те же данные должны использоваться для:

схемы оборудования (GoJS);
карты сети (Leaflet);
таблиц и отчетов;
в дальнейшем — поиска, фильтрации и аналитики.

GoJS перестал рассматриваться как центр проекта — это только один из интерфейсов отображения.

Основная предметная модель

На текущий момент пришли к следующей иерархии:

Country
└── Region (область)
    └── District (район)
        └── Locality (населенный пункт)
            └── Building (строение)
                ├── Room
                │   └── Rack
                │       └── Equipment
                └── Equipment
                    └── Slot
                        └── Port
Building

Строение — первая сущность, имеющая реальные координаты.

Тип строения может быть:

здание;
мачта;
башня;
столб;
уличный контейнер.

Поля:

координаты;
адрес;
название;
тип.

Все оборудование наследует координаты Building.

Equipment

Оборудование:

MUX
Router
Switch
Radio
UPS
OLT
и т.д.

Именно Equipment отображается в GoJS.

Slot

Слот оборудования.

Содержит Ports.

Port

Порт оборудования.

Хранит:

id
name
portTypeId

Связи GoJS строятся между портами.

Отображение в GoJS

Структура узла стала полностью соответствовать модели данных.

Node
│
├── Header
├── Toolbar
└── SlotArea
      ├── Slot
      │     ├── Port
      │     ├── Port
      │     └── Port
      ├── Slot
      └── Slot
Новая архитектура шаблонов

Созданы отдельные компоненты:

createNode()

    createNodeHeader()

    createNodeBody()

        createNodeToolbar()

        createSlotArea()

            createSlot()

                createPort()

Теперь каждый файл отвечает только за одну часть узла.

ItemArray

Переход на новую структуру GoJS полностью завершён.

Используется правильная схема:

SlotArea
    itemArray -> slots

Slot
    itemArray -> ports

Исправлена ошибка использования add().

Теперь применяется

itemTemplate

что соответствует архитектуре GoJS.

Новый JSON

Старый JSON был плоским.

Теперь используется вложенная модель:

Node
{
    slots:[
        {
            ports:[
                ...
            ]
        }
    ]
}

Это соответствует будущей модели SQLite.

PortStyle

Полностью отказались от хранения стиля внутри JSON.

Теперь JSON содержит только

portTypeId

а отображение определяется отдельно.

Создан:

portStyle.js

в котором хранится описание каждого типа порта.

Используются типы

OPT
RADIO
ETH
CROSS
OTHER
Presentation Builder

Появился первый Builder.

applyNodePresentation()

    applyPortStyle()

Он подготавливает данные перед передачей в GoJS.

GoJS больше не должен вычислять стиль самостоятельно.

Текущая структура проекта
app/

core/

    builders/
        presentation/

    models/

diagram/

    node/

        createNode.js

        createNodeBody.js

        createNodeToolbar.js

        createSlotArea.js

        createSlot.js

        createPort.js

    styles/

data/

pluginJsCss/

Структура стала модульной.

Карта (Leaflet)

После обсуждения определили архитектуру.

Leaflet будет использовать ту же самую БД.

На карте отображаются:

административные единицы;
строения;
оборудование;
связи.
Отображение карты

Пользователь сможет выбирать, что отображать.

Например:

✓ страны

✓ области

✓ районы

✓ населенные пункты

✓ строения

✓ оборудование

✓ радиорелейные линии
Координаты

Координаты есть только у Building.

Equipment использует координаты Building.

Это исключает дублирование данных.

Административные единицы

Country

Region

District

Locality

не имеют координат.

Вместо этого они будут иметь

path

который используется Leaflet для построения границ.

Связи

GoJS

Port
──────────
Port

Leaflet

Equipment
──────────
Equipment

При этом источник данных остаётся один.

Карта просто использует связи портов и поднимается до оборудования.

Архитектурная идея

Мы постепенно пришли к пониманию, что существует три уровня.

SQLite

↓

Domain Model

↓

Builders

↓

UI

UI может быть разным:

GoJS

Leaflet

Таблицы

Отчёты

Все используют одну и ту же модель данных.

Что уже выполнено

✅ новая структура проекта

✅ разбиение createNode()

✅ createSlotArea()

✅ createSlot()

✅ createPort()

✅ переход на itemTemplate

✅ новая модель JSON

✅ переход на slots/ports

✅ вынесение PortStyle

✅ первый Presentation Builder

✅ подготовка архитектуры для Leaflet

Что планируется дальше
1. Спроектировать модель БД

Без SQL.

Именно сущности и связи.

2. Спроектировать SQLite

Основные таблицы:

Country

Region

District

Locality

Building

Room

Rack

Equipment

Slot

Port

Link
3. Создать Domain Model

Отдельные классы:

Country

Region

District

Locality

Building

Room

Rack

Equipment

Slot

Port

Link
4. Repository

Получение данных только отсюда.

GoJS и Leaflet не должны знать о SQLite.

5. Builders

Будут преобразовывать Domain Model в представление.

Например:

GoJSNodeBuilder

LeafletMarkerBuilder

PresentationBuilder
6. Leaflet

Построение карты на основе той же модели.

Основной принцип проекта

Одна модель данных → несколько независимых представлений.

Именно эта идея сейчас лежит в основе архитектуры проекта и будет определять дальнейшее развитие.