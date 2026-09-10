<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../oPlan2.db');

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $groupId = (int)($data['id'] ?? 0);
    $name = trim($data['name'] ?? '');

    if ($groupId <= 0) {
        throw new Exception('Не указан ID группы');
    }

    if ($name === '') {
        throw new Exception('Название группы не может быть пустым');
    }

    $stmt = $db->prepare("
        UPDATE Groups
        SET name = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $name,
        $groupId
    ]);

    if ($stmt->rowCount() === 0) {
        throw new Exception('Группа не найдена');
    }

    echo json_encode([
        'success' => true
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    // Нарушение UNIQUE — имя уже существует
    if ($e->getCode() === '23000') {

        http_response_code(409);

        echo json_encode([
            'success' => false,
            'error' => 'Группа с таким названием уже существует'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}