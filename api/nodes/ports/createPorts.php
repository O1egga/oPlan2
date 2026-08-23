<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(
    file_get_contents('php://input'),
    true
);

if (!$data) {
    http_response_code(400);

    echo json_encode([
        'error' => 'Некорректный JSON'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$nodeId = (int)($data['nodeId'] ?? 0);
$ports = $data['ports'] ?? [];

if ($nodeId <= 0) {
    http_response_code(400);

    echo json_encode([
        'error' => 'Не указан nodeId'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if (!is_array($ports) || count($ports) === 0) {
    http_response_code(400);

    echo json_encode([
        'error' => 'Список портов пуст'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmt = $db->prepare("
    INSERT INTO Ports (
        nodeId,
        portTypeId,
        name,
        portNo
    )
    VALUES (
        :nodeId,
        :portTypeId,
        :name,
        :portNo
    )
");

try {

    $db->beginTransaction();

    foreach ($ports as $port) {

        $portTypeId = (int)($port['portTypeId'] ?? 0);
        $portNo = (int)($port['portNo'] ?? 0);
        $name = trim($port['name'] ?? '');

        if ($portTypeId <= 0) {
            throw new Exception('Некорректный portTypeId');
        }

        if ($portNo <= 0) {
            throw new Exception('Некорректный portNo');
        }

        if ($name === '') {
            throw new Exception('Не указано имя порта');
        }

        $stmt->execute([
            ':nodeId' => $nodeId,
            ':portTypeId' => $portTypeId,
            ':name' => $name,
            ':portNo' => $portNo
        ]);
    }

    $db->commit();

    echo json_encode([
        'success' => true,
        'count' => count($ports)
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    if ($db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(400);

    echo json_encode([
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}