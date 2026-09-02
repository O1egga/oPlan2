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

    // Получаем модель, производителя и тип
    $stmt = $db->prepare("
        SELECT
            Models.id,
            Models.vendorId,
            ModelNodeTypes.nodeTypeId
        FROM Models
        LEFT JOIN ModelNodeTypes
            ON ModelNodeTypes.modelId = Models.id
        WHERE Models.id = ?
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
    $nodeTypeId = (int)$model['nodeTypeId'];

    $db->beginTransaction();

    // Проверяем использование модели оборудованием
    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM Nodes
        WHERE modelId = ?
    ");

    $stmt->execute([$id]);

    if ((int)$stmt->fetchColumn() > 0) {

        $db->rollBack();

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'Модель используется оборудованием и не может быть удалена'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Удаляем связь модели с типом
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

    // Если у производителя больше нет моделей — удаляем производителя
    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM Models
        WHERE vendorId = ?
    ");

    $stmt->execute([$vendorId]);

    if ((int)$stmt->fetchColumn() === 0) {

        $stmt = $db->prepare("
            DELETE FROM Vendors
            WHERE id = ?
        ");

        $stmt->execute([$vendorId]);
    }

    // Если у типа больше нет моделей — удаляем тип
    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM ModelNodeTypes
        WHERE nodeTypeId = ?
    ");

    $stmt->execute([$nodeTypeId]);

    if ((int)$stmt->fetchColumn() === 0) {

        $stmt = $db->prepare("
            DELETE FROM NodeTypes
            WHERE id = ?
        ");

        $stmt->execute([$nodeTypeId]);
    }

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