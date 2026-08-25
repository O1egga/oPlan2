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

$groupId = (int)($data['id'] ?? 0);

$parentId = array_key_exists('parentId', $data)
    && $data['parentId'] !== null
    && $data['parentId'] !== ''
        ? (int)$data['parentId']
        : null;

if ($groupId <= 0) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => 'Не указан ID группы'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    // Обновляем родителя группы
    $stmt = $db->prepare("
        UPDATE Groups
        SET parentId = :parentId
        WHERE id = :id
    ");

    $stmt->execute([
        ':parentId' => $parentId,
        ':id' => $groupId
    ]);

    echo json_encode([
        'success' => true
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}