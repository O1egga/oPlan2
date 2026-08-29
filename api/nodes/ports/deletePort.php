<?php

header('Content-Type: application/json; charset=utf-8');

$db = new PDO('sqlite:../../../oPlan2.db');

$db->setAttribute(
    PDO::ATTR_ERRMODE,
    PDO::ERRMODE_EXCEPTION
);

try {

    $data = json_decode(
        file_get_contents('php://input'),
        true
    );

    $ids = $data['ids'] ?? [];

    if (!is_array($ids) || count($ids) === 0) {

        throw new Exception(
            'Не переданы ID портов'
        );

    }


    // Только положительные целые ID
    $ids = array_values(
        array_filter(
            array_map('intval', $ids),
            fn($id) => $id > 0
        )
    );

    if (count($ids) === 0) {

        throw new Exception(
            'Некорректные ID портов'
        );

    }


    // ============================================
    // Проверяем, есть ли Link хотя бы на одном порту
    // ============================================

    $placeholders =
        implode(
            ',',
            array_fill(
                0,
                count($ids),
                '?'
            )
        );


    // ============================================
    // Определяем занятые порты
    // ============================================

    $stmt = $db->prepare("
        SELECT fromPort AS portId
        FROM Links
        WHERE fromPort IN ($placeholders)

        UNION

        SELECT toPort AS portId
        FROM Links
        WHERE toPort IN ($placeholders)
    ");

    $stmt->execute(
        array_merge(
            $ids,
            $ids
        )
    );

    $usedPortIds =
        array_map(
            'intval',
            $stmt->fetchAll(PDO::FETCH_COLUMN)
        );

    // ============================================
    // Только проверка
    // ============================================

    if (!empty($data['checkOnly'])) {

        echo json_encode([
            'success' => count($usedPortIds) === 0,
            'usedPortIds' => $usedPortIds
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    
    // ============================================
    // Если есть хотя бы один занятый —
    // НЕ удаляем ничего
    // ============================================

    if (count($usedPortIds) > 0) {

        echo json_encode([
            'success' => false,
            'error' =>
                'Нельзя удалить порты: один или несколько портов используются в Link',
            'usedPortIds' =>
                $usedPortIds
        ], JSON_UNESCAPED_UNICODE);

        exit;

    }


    // ============================================
    // Все порты свободны — удаляем
    // ============================================

    $stmt = $db->prepare("
        DELETE FROM Ports
        WHERE id IN ($placeholders)
    ");

    $stmt->execute($ids);


    echo json_encode([
        'success' => true
    ], JSON_UNESCAPED_UNICODE);


} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}