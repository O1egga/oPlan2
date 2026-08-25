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

    $groupId = $data['groupId'] ?? null;

    if ($nodeId <= 0) {
        throw new Exception('Не указан ID оборудования');
    }

    if ($groupId !== null) {
        $groupId = (int)$groupId;
    }

    $stmt = $db->prepare("
        UPDATE Nodes
        SET groupId = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $groupId,
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