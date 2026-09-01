<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $name = trim($data['name'] ?? '');

    if ($name === '') {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Не указано название типа'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Проверяем дубликат
    $stmt = $db->prepare("
        SELECT id
        FROM NodeTypes
        WHERE LOWER(name) = LOWER(?)
    ");

    $stmt->execute([$name]);

    if ($stmt->fetch()) {

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'Такой тип уже существует'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Создаём новый тип
    $stmt = $db->prepare("
        INSERT INTO NodeTypes (
            name,
            fill
        )
        VALUES (?, NULL)
    ");

    $stmt->execute([$name]);

    $id = (int)$db->lastInsertId();

    echo json_encode([
        'success' => true,
        'id' => $id,
        'name' => $name,
        'fill' => null
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}