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
    $name = trim($data['name'] ?? '');

    if ($id <= 0 || $name === '') {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Не заполнены обязательные поля'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Получаем производителя модели
    $stmt = $db->prepare("
        SELECT vendorId
        FROM Models
        WHERE id = ?
    ");

    $stmt->execute([$id]);

    $model = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$model) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'Модель не найдена'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $vendorId = (int)$model['vendorId'];

    // Проверяем дубликат модели у этого производителя
    $stmt = $db->prepare("
        SELECT id
        FROM Models
        WHERE vendorId = ?
          AND LOWER(name) = LOWER(?)
          AND id != ?
    ");

    $stmt->execute([
        $vendorId,
        $name,
        $id
    ]);

    if ($stmt->fetch()) {

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'У этого производителя такая модель уже существует'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Переименовываем модель
    $stmt = $db->prepare("
        UPDATE Models
        SET name = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $name,
        $id
    ]);

    echo json_encode([
        'success' => true,
        'id' => $id,
        'name' => $name
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}