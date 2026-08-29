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

    $id = (int)($data['id'] ?? 0);
    $fromPort = (int)($data['fromPort'] ?? 0);
    $toPort = (int)($data['toPort'] ?? 0);
    $linkTypeId = (int)($data['linkTypeId'] ?? 0);


    if ($id <= 0) {

        throw new Exception(
            'Некорректный ID Link'
        );

    }


    if ($fromPort <= 0 || $toPort <= 0) {

        throw new Exception(
            'Некорректный порт'
        );

    }


    $stmt = $db->prepare("
        UPDATE Links
        SET
            fromPort = ?,
            toPort = ?,
            linkTypeId = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $fromPort,
        $toPort,
        $linkTypeId,
        $id
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