<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(
    file_get_contents('php://input'),
    true
);

if (!$data) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Некорректный JSON'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$name = trim($data['name'] ?? '');
$groupTypeId = (int)($data['groupTypeId'] ?? 0);

$parentId = array_key_exists('parentId', $data)
    && $data['parentId'] !== null
    && $data['parentId'] !== ''
        ? (int)$data['parentId']
        : null;

$note = trim($data['note'] ?? '');

if ($name === '') {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Не указано название группы'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if ($groupTypeId <= 0) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Не указан тип группы'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    // Проверяем, существует ли такая группа
    $stmt = $db->prepare("
        SELECT id
        FROM Groups
        WHERE name = :name
        AND groupTypeId = :groupTypeId
        AND (
            parentId = :parentId
            OR (parentId IS NULL AND :parentId IS NULL)
        )
        LIMIT 1
    ");

    $stmt->execute([
        ':name' => $name,
        ':groupTypeId' => $groupTypeId,
        ':parentId' => $parentId
    ]);

    $existingId = $stmt->fetchColumn();

    if ($existingId !== false) {

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'Группа такого типа с таким названием уже существует',
            'id' => (int)$existingId
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Создаём группу
    $stmt = $db->prepare("
        INSERT INTO Groups (
            name,
            groupTypeId,
            parentId,
            note
        )
        VALUES (
            :name,
            :groupTypeId,
            :parentId,
            :note
        )
    ");

    $stmt->execute([
        ':name' => $name,
        ':groupTypeId' => $groupTypeId,
        ':parentId' => $parentId,
        ':note' => $note
    ]);

    echo json_encode([
        'success' => true,
        'id' => (int)$db->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}