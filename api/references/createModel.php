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
    $vendorId = (int)($data['vendorId'] ?? 0);
    $nodeTypeId = (int)($data['nodeTypeId'] ?? 0);

    if (
        $name === '' ||
        $vendorId <= 0 ||
        $nodeTypeId <= 0
    ) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Не заполнены обязательные поля'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Проверяем производителя
    $stmt = $db->prepare("
        SELECT id
        FROM Vendors
        WHERE id = ?
    ");

    $stmt->execute([$vendorId]);

    if (!$stmt->fetch()) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Производитель не найден'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Проверяем тип
    $stmt = $db->prepare("
        SELECT id
        FROM NodeTypes
        WHERE id = ?
    ");

    $stmt->execute([$nodeTypeId]);

    if (!$stmt->fetch()) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Тип оборудования не найден'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Проверяем, нет ли такой модели у этого производителя
    $stmt = $db->prepare("
        SELECT id
        FROM Models
        WHERE vendorId = ?
          AND LOWER(name) = LOWER(?)
    ");

    $stmt->execute([
        $vendorId,
        $name
    ]);

    if ($stmt->fetch()) {

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'У этого производителя такая модель уже существует'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Начинаем транзакцию
    $db->beginTransaction();

    // Создаём модель
    $stmt = $db->prepare("
        INSERT INTO Models (
            name,
            vendorId
        )
        VALUES (?, ?)
    ");

    $stmt->execute([
        $name,
        $vendorId
    ]);

    $modelId = (int)$db->lastInsertId();

    // Связываем модель с типом
    $stmt = $db->prepare("
        INSERT INTO ModelNodeTypes (
            modelId,
            nodeTypeId
        )
        VALUES (?, ?)
    ");

    $stmt->execute([
        $modelId,
        $nodeTypeId
    ]);

    $db->commit();

    echo json_encode([
        'success' => true,
        'id' => $modelId,
        'name' => $name,
        'vendorId' => $vendorId,
        'nodeTypeId' => $nodeTypeId
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    if ($db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}