<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $stmt = $db->query("
        SELECT
            n.id,
            n.name,
            n.nodeTypeId,
            n.modelId,
            n.groupId,
            n.note,

            m.name AS model,
            m.vendorId,

            v.name AS vendor

        FROM Nodes n

        JOIN Models m
            ON m.id = n.modelId

        JOIN Vendors v
            ON v.id = m.vendorId

        ORDER BY n.id
    ");

    $nodes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($nodes as &$node) {

        $node['id'] = (int)$node['id'];
        $node['nodeTypeId'] = (int)$node['nodeTypeId'];
        $node['modelId'] = (int)$node['modelId'];
        $node['vendorId'] = (int)$node['vendorId'];

        if ($node['groupId'] !== null) {
            $node['groupId'] = (int)$node['groupId'];
        }
    }

    unset($node);

    echo json_encode(
        $nodes,
        JSON_UNESCAPED_UNICODE
    );

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}