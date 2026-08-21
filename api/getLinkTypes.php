<?php

// получить все типы связей

$db = new PDO('sqlite:../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $db->query("
    SELECT
        id,
        name,
        stroke,
        strokeWidth,
        strokeDashArray
    FROM LinkTypes
    ORDER BY id
");

header('Content-Type: application/json; charset=utf-8');

echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC),
    JSON_UNESCAPED_UNICODE
);