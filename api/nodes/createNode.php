<?php

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

header('Content-Type: application/json; charset=utf-8');

// Получаем JSON из запроса
$data = json_decode(
    file_get_contents('php://input'),
    true
);

// Проверяем обязательные поля
if (
    empty($data['nodeTypeId']) ||
    empty($data['modelId'])
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Не заполнены обязательные поля'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$name = trim($data['name']);
$nodeTypeId = (int)$data['nodeTypeId'];
$modelId = (int)$data['modelId'];
$groupId = isset($data['groupId'])
    ? (int)$data['groupId']
    : null;
$note = $data['note'] ?? null;

// Создаём оборудование
$stmt = $db->prepare("
    INSERT INTO Nodes (
        name,
        nodeTypeId,
        modelId,
        groupId,
        note
    )
    VALUES (?, ?, ?, ?, ?)
");

$stmt->execute([
    $name,
    $nodeTypeId,
    $modelId,
    $groupId,
    $note
]);

// Получаем id созданной записи
$nodeId = $db->lastInsertId();

echo json_encode([
    'success' => true,
    'id' => (int)$nodeId
], JSON_UNESCAPED_UNICODE);