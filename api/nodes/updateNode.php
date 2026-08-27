<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(
    PDO::ATTR_ERRMODE,
    PDO::ERRMODE_EXCEPTION
);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $nodeId = (int)($data['id'] ?? 0);
    $nodeTypeId = (int)($data['nodeTypeId'] ?? 0);
    $modelId = (int)($data['modelId'] ?? 0);
    $name = trim($data['name'] ?? '');

    if ($nodeId <= 0) {
        throw new Exception(
            'Не указан ID оборудования'
        );
    }

    if ($nodeTypeId <= 0) {
        throw new Exception(
            'Не указан тип оборудования'
        );
    }

    if ($modelId <= 0) {
        throw new Exception(
            'Не указана модель'
        );
    }

    // Проверяем существование оборудования
    $stmt = $db->prepare("
        SELECT id
        FROM Nodes
        WHERE id = ?
    ");

    $stmt->execute([$nodeId]);

    if (!$stmt->fetch()) {
        throw new Exception(
            'Оборудование не найдено'
        );
    }

    // Обновляем оборудование
    $stmt = $db->prepare("
        UPDATE Nodes
        SET
            nodeTypeId = ?,
            modelId = ?,
            name = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $nodeTypeId,
        $modelId,
        $name,
        $nodeId
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