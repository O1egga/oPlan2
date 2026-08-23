<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $stmt = $db->query("
        SELECT
            id,
            fromPort,
            toPort,
            linkTypeId,
            name,
            note

        FROM Links

        ORDER BY id
    ");

    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($links as &$link) {

        $link['id'] = (int)$link['id'];
        $link['fromPort'] = (string)$link['fromPort'];
        $link['toPort'] = (string)$link['toPort'];
        $link['linkTypeId'] = (int)$link['linkTypeId'];

    }

    unset($link);

    echo json_encode(
        $links,
        JSON_UNESCAPED_UNICODE
    );

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}