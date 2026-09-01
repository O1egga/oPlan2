<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $id = (int)($data['id'] ?? 0);

    if ($id <= 0) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Не указан ID типа'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Проверяем существование типа
    $stmt = $db->prepare("
        SELECT id
        FROM NodeTypes
        WHERE id = ?
    ");

    $stmt->execute([$id]);

    if (!$stmt->fetch()) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'Тип не найден'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Проверяем наличие моделей
    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM ModelNodeTypes
        WHERE nodeTypeId = ?
    ");

    $stmt->execute([$id]);

    $modelCount = (int)$stmt->fetchColumn();

    if ($modelCount > 0) {

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'У типа есть модели'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Удаляем тип
    $stmt = $db->prepare("
        DELETE FROM NodeTypes
        WHERE id = ?
    ");

    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'id' => $id
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}