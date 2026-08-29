<?php
// получить производителей конкретного типа оборудования для формы

$db = new PDO('sqlite:../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$nodeTypeId = (int)($_GET['nodeTypeId'] ?? 0);

$stmt = $db->prepare("
    SELECT DISTINCT
        v.id,
        v.name
    FROM Vendors v
    JOIN Models m
        ON m.vendorId = v.id
    JOIN ModelNodeTypes mnt
        ON mnt.modelId = m.id
    WHERE mnt.nodeTypeId = ?
    ORDER BY v.name
");

$stmt->execute([$nodeTypeId]);

header('Content-Type: application/json; charset=utf-8');

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC),
    JSON_UNESCAPED_UNICODE
);