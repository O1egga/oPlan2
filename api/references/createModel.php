<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $name = trim($data['name'] ?? '');
    $vendorName = trim($data['vendor'] ?? '');
    $nodeTypeName = trim($data['nodeType'] ?? '');

    if (
        $name === '' ||
        $vendorName === '' ||
        $nodeTypeName === ''
    ) {

        http_response_code(400);

        echo json_encode([
            'success' => false,
            'error' => 'Не заполнены обязательные поля'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $db->beginTransaction();

    // ------------------------------------------------
    // Тип
    // ------------------------------------------------

    $stmt = $db->prepare("
        SELECT id, name, fill
        FROM NodeTypes
        WHERE LOWER(name) = LOWER(?)
    ");

    $stmt->execute([$nodeTypeName]);

    $nodeType = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$nodeType) {

        $stmt = $db->prepare("
            INSERT INTO NodeTypes (name, fill)
            VALUES (?, ?)
        ");

        $stmt->execute([
            $nodeTypeName,
            '#90CAF9'
        ]);

        $nodeTypeId = (int)$db->lastInsertId();
        $nodeTypeFill = '#90CAF9';

    } else {

        $nodeTypeId = (int)$nodeType['id'];
        $nodeTypeName = $nodeType['name'];
        $nodeTypeFill = $nodeType['fill'];
    }


    // ------------------------------------------------
    // Производитель
    // ------------------------------------------------

    $stmt = $db->prepare("
        SELECT id, name
        FROM Vendors
        WHERE LOWER(name) = LOWER(?)
    ");

    $stmt->execute([$vendorName]);

    $vendor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$vendor) {

        $stmt = $db->prepare("
            INSERT INTO Vendors (name)
            VALUES (?)
        ");

        $stmt->execute([$vendorName]);

        $vendorId = (int)$db->lastInsertId();
        $vendorName = $vendorName;

    } else {

        $vendorId = (int)$vendor['id'];
        $vendorName = $vendor['name'];
    }


    // ------------------------------------------------
    // Проверяем модель
    // ------------------------------------------------

    $stmt = $db->prepare("
        SELECT id
        FROM Models
        WHERE vendorId = ?
          AND LOWER(name) = LOWER(?)
    ");

    $stmt->execute([
        $vendorId,
        $name
    ]);

    if ($stmt->fetch()) {

        $db->rollBack();

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'У этого производителя такая модель уже существует'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }


    // ------------------------------------------------
    // Создаём модель
    // ------------------------------------------------

    $stmt = $db->prepare("
        INSERT INTO Models (
            name,
            vendorId
        )
        VALUES (?, ?)
    ");

    $stmt->execute([
        $name,
        $vendorId
    ]);

    $modelId = (int)$db->lastInsertId();


    // ------------------------------------------------
    // Связываем модель с типом
    // ------------------------------------------------

    $stmt = $db->prepare("
        INSERT INTO ModelNodeTypes (
            modelId,
            nodeTypeId
        )
        VALUES (?, ?)
    ");

    $stmt->execute([
        $modelId,
        $nodeTypeId
    ]);


    $db->commit();

    echo json_encode([
        'success' => true,
        'id' => $modelId,
        'name' => $name,
        'vendorId' => $vendorId,
        'vendor' => $vendorName,
        'nodeTypeId' => $nodeTypeId,
        'nodeType' => $nodeTypeName,
        'fill' => $nodeTypeFill
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    if ($db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}