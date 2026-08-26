<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $nodeId = (int)($data['id'] ?? 0);

    if ($nodeId <= 0) {
        throw new Exception('Не указан ID оборудования');
    }

    // Проверяем, что оборудование существует
    $stmt = $db->prepare("
        SELECT id
        FROM Nodes
        WHERE id = ?
    ");

    $stmt->execute([$nodeId]);

    if (!$stmt->fetch()) {
        throw new Exception('Оборудование не найдено');
    }

    // Начинаем транзакцию
    $db->beginTransaction();

    // Удаляем порты оборудования
    $stmt = $db->prepare("
        DELETE FROM Ports
        WHERE nodeId = ?
    ");

    $stmt->execute([$nodeId]);

    // Удаляем оборудование
    $stmt = $db->prepare("
        DELETE FROM Nodes
        WHERE id = ?
    ");

    $stmt->execute([$nodeId]);

    // Завершаем транзакцию
    $db->commit();

    echo json_encode([
        'success' => true
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