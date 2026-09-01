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
            'error' => 'Не указан ID модели'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Проверяем существование модели
    $stmt = $db->prepare("
        SELECT id
        FROM Models
        WHERE id = ?
    ");

    $stmt->execute([$id]);

    if (!$stmt->fetch()) {

        http_response_code(404);

        echo json_encode([
            'success' => false,
            'error' => 'Модель не найдена'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $db->beginTransaction();

    // Удаляем связи модели с типами
    $stmt = $db->prepare("
        DELETE FROM ModelNodeTypes
        WHERE modelId = ?
    ");

    $stmt->execute([$id]);

    // Удаляем модель
    $stmt = $db->prepare("
        DELETE FROM Models
        WHERE id = ?
    ");

    $stmt->execute([$id]);

    $db->commit();

    echo json_encode([
        'success' => true,
        'id' => $id
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