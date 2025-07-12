// src/features/connector/validation.ts
import { Rect, ConnectionPoint } from "../../types/types";

/**
 * Нормали для каждой разрешённой ориентации порта:
 * показывают направление от центра наружу.
 */
const normals: Record<ConnectionPoint['angle'], { nx: number; ny: number }> = {
    0:    { nx:  1, ny:  0 }, // вправо
    180:  { nx: -1, ny:  0 }, // влево
    90:   { nx:  0, ny:  1 }, // вниз
    [-90]:{ nx:  0, ny: -1 }, // вверх
};

// Допуск для сравнения координат (плавающая точка)
const EPS = 0.01;

/**
 * Проверяет корректность ConnectionPoint:
 * - Угол — один из 0, 90, 180, -90
 * - Точка лежит ровно на соответствующей грани прямоугольника (с учётом EPS)
 * - Направление вектора (от центра к точке) совпадает с нормалью (наружу)
 */
export function validateConnectionPoint(
    rect: Rect,
    cp: ConnectionPoint
): boolean {
    const { angle, point } = cp;

    // 1) проверяем валидность угла
    if (!(angle in normals)) {
        throw new Error(`Invalid angle ${angle}. Must be one of 0, 90, 180, -90.`);
    }
    const { nx, ny } = normals[angle];

    const { position, size } = rect;
    const halfW = size.width  / 2;
    const halfH = size.height / 2;

    // 2) вычисляем ожидаемую линию границы
    const borderX = position.x + nx * halfW;
    const borderY = position.y + ny * halfH;

    // 3) проверяем, лежит ли точка на границе (±EPS)
    const onBorder = nx !== 0
        ? // вертикальная грань: x = borderX, y ∈ [top..bottom]
        Math.abs(point.x - borderX) < EPS &&
        point.y >= position.y - halfH - EPS &&
        point.y <= position.y + halfH + EPS
        : // горизонтальная грань: y = borderY, x ∈ [left..right]
        Math.abs(point.y - borderY) < EPS &&
        point.x >= position.x - halfW - EPS &&
        point.x <= position.x + halfW + EPS;

    if (!onBorder) {
        throw new Error(
            `ConnectionPoint ${JSON.stringify(cp)} must lie on the ${angle}° border of rect centered at (${position.x},${position.y}).`
        );
    }

    // 4) проверяем направление наружу: (point - center)·normal > 0
    const dx = point.x - position.x;
    const dy = point.y - position.y;
    const dot = dx * nx + dy * ny;
    if (dot < -EPS) {
        throw new Error(
            `ConnectionPoint ${JSON.stringify(cp)} normal (${nx},${ny}) must point outward.`
        );
    }

    return true;
}
