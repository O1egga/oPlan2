<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$nodeId = isset($_GET['nodeId'])
    ? (int)$_GET['nodeId']
    : null;
    

try {

    $sql = "
        SELECT
            p.id,
            p.nodeId,
            p.portTypeId,
            p.name,
            p.portNo,
            p.label,
            p.note
        FROM Ports p
    ";

    $params = [];

    if ($nodeId !== null) {
        $sql .= " WHERE p.nodeId = :nodeId";
        $params[':nodeId'] = $nodeId;
    }

    $sql .= "
        ORDER BY
            p.nodeId,
            p.portTypeId,
            p.portNo
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $ports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($ports as &$port) {

        $port['id'] = (int)$port['id'];
        $port['nodeId'] = (int)$port['nodeId'];
        $port['portTypeId'] = (int)$port['portTypeId'];
        $port['portNo'] = (int)$port['portNo'];

    }

    unset($port);

    echo json_encode(
        $ports,
        JSON_UNESCAPED_UNICODE
    );

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}