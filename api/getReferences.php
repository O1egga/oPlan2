<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $nodeTypes = $db->query("
        SELECT
            id,
            name,
            fill
        FROM NodeTypes
        ORDER BY id
    ")->fetchAll(PDO::FETCH_ASSOC);


    $vendors = $db->query("
        SELECT
            id,
            name
        FROM Vendors
        ORDER BY id
    ")->fetchAll(PDO::FETCH_ASSOC);


    $models = $db->query("
        SELECT
            id,
            name,
            vendorId
        FROM Models
        ORDER BY id
    ")->fetchAll(PDO::FETCH_ASSOC);


    $modelNodeTypes = $db->query("
        SELECT
            modelId,
            nodeTypeId
        FROM ModelNodeTypes
        ORDER BY modelId, nodeTypeId
    ")->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode([
        'nodeTypes' => $nodeTypes,
        'vendors' => $vendors,
        'models' => $models,
        'modelNodeTypes' => $modelNodeTypes
    ], JSON_UNESCAPED_UNICODE);


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}