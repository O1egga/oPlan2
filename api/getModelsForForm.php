<?php
// получить модели производителя и типа оборудования для формы

$db = new PDO('sqlite:../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$nodeTypeId = (int)($_GET['nodeTypeId'] ?? 0);
$vendorId = (int)($_GET['vendorId'] ?? 0);

$stmt = $db->prepare("
    SELECT
        m.id,
        m.name
    FROM Models m
    JOIN ModelNodeTypes mnt
        ON mnt.modelId = m.id
    WHERE m.vendorId = ?
      AND mnt.nodeTypeId = ?
    ORDER BY m.name
");

$stmt->execute([
    $vendorId,
    $nodeTypeId
]);

header('Content-Type: application/json; charset=utf-8');

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC),
    JSON_UNESCAPED_UNICODE
);