<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $stmt = $db->query("
        SELECT
            g.id,
            g.name,
            g.groupTypeId,
            g.parentId,
            g.note,

            gt.name AS groupTypeName,
            gt.category,
            gt.figure,
            gt.fill,
            gt.header

        FROM Groups g

        JOIN GroupTypes gt
            ON gt.id = g.groupTypeId

        ORDER BY g.id
    ");

    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($groups as &$group) {

        $group['id'] = (int)$group['id'];
        $group['groupTypeId'] = (int)$group['groupTypeId'];

        if ($group['parentId'] !== null) {
            $group['parentId'] = (int)$group['parentId'];
        }

    }

    unset($group);

    echo json_encode(
        $groups,
        JSON_UNESCAPED_UNICODE
    );

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}