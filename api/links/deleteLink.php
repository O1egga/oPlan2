<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!is_array($data)) {
        throw new Exception('Некорректный JSON');
    }

    $id = (int)($data['id'] ?? 0);

    if ($id <= 0) {
        throw new Exception('Не указан id Link');
    }

    $stmt = $db->prepare("
        DELETE FROM Links
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id
    ]);

    echo json_encode([
        'success' => true
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}