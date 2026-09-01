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

    // Проверяем дубликат
    $stmt = $db->prepare("
        SELECT id
        FROM Vendors
        WHERE LOWER(name) = LOWER(?)
          AND id != ?
    ");

    $stmt->execute([
        $name,
        $id
    ]);

    if ($stmt->fetch()) {

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'Такой производитель уже существует'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Переименовываем производителя
    $stmt = $db->prepare("
        UPDATE Vendors
        SET name = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $name,
        $id
    ]);

    if ($stmt->rowCount() === 0) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'Производитель не найден'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

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