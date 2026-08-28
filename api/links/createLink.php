<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!is_array($data)) {
        throw new Exception('Некорректный JSON');
    }

    $fromPort = (int)($data['fromPort'] ?? 0);
    $toPort = (int)($data['toPort'] ?? 0);
    $linkTypeId = (int)($data['linkTypeId'] ?? 0);

    if ($fromPort <= 0) {
        throw new Exception('Не указан fromPort');
    }

    if ($toPort <= 0) {
        throw new Exception('Не указан toPort');
    }

    if ($linkTypeId <= 0) {
        throw new Exception('Не указан linkTypeId');
    }

    if ($fromPort === $toPort) {
        throw new Exception(
            'Нельзя соединить порт сам с собой'
        );
    }

    $stmt = $db->prepare("
        INSERT INTO Links (
            fromPort,
            toPort,
            linkTypeId
        )
        VALUES (
            :fromPort,
            :toPort,
            :linkTypeId
        )
    ");

    $stmt->execute([
        ':fromPort' => $fromPort,
        ':toPort' => $toPort,
        ':linkTypeId' => $linkTypeId
    ]);

    echo json_encode([
        'success' => true,
        'id' => (int)$db->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}