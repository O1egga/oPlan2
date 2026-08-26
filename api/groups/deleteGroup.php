<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $groupId = (int)($data['id'] ?? 0);

    if ($groupId <= 0) {
        throw new Exception('Не указан ID группы');
    }

    // Проверяем, что группа существует
    $stmt = $db->prepare("
        SELECT id
        FROM Groups
        WHERE id = ?
    ");

    $stmt->execute([$groupId]);

    if (!$stmt->fetch()) {
        throw new Exception('Группа не найдена');
    }

    // Проверяем, что группа пустая
    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM Groups
        WHERE parentId = ?
    ");

    $stmt->execute([$groupId]);

    $childGroups = (int)$stmt->fetchColumn();

    if ($childGroups > 0) {
        throw new Exception(
            'Нельзя удалить группу, содержащую другие группы'
        );
    }

    // Проверяем оборудование
    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM Nodes
        WHERE groupId = ?
    ");

    $stmt->execute([$groupId]);

    $nodes = (int)$stmt->fetchColumn();

    if ($nodes > 0) {
        throw new Exception(
            'Нельзя удалить группу, содержащую оборудование'
        );
    }

    // Удаляем группу
    $stmt = $db->prepare("
        DELETE FROM Groups
        WHERE id = ?
    ");

    $stmt->execute([$groupId]);

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