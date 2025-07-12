// src/features/connector/dataConverter.ts
import { validateConnectionPoint } from "./validation";
import { ConnectionPoint, Point, Rect } from "../../types/types";
import { route, Rectangle as BSRect } from "@blocksuite/connector";

const EPS = 2;

function shortcutLShape(from: Point, to: Point): Point[] {
    // Если ближе по вертикали (столбец), то делаем вертикальную ломаную
    if (Math.abs(from.x - to.x) < Math.abs(from.y - to.y)) {
        return [
            from,
            { x: from.x, y: (from.y + to.y) / 2 },
            { x: to.x,   y: (from.y + to.y) / 2 },
            to,
        ];
    } else {
        // иначе горизонтальную ломаную
        return [
            from,
            { x: (from.x + to.x) / 2, y: from.y },
            { x: (from.x + to.x) / 2, y: to.y },
            to,
        ];
    }
}

export function dataConverter(
    rectA: Rect,
    rectB: Rect,
    cA: ConnectionPoint,
    cB: ConnectionPoint,
    smartRouting: boolean = true  // <- параметр, включающий обход препятствий
): Point[] {
    validateConnectionPoint(rectA, cA);
    validateConnectionPoint(rectB, cB);

    const start = cA.point;
    const end = cB.point;

    // 1. Прямая, если X или Y совпадают
    if (Math.abs(start.x - end.x) < EPS || Math.abs(start.y - end.y) < EPS) {
        return [start, end];
    }

    // 2. L-образная ломаная (универсально)
    if (!smartRouting) {
        return shortcutLShape(start, end);
    }

    // 3. Умный роутинг с препятствиями (fallback)
    const inflate = 2;
    const bsA = new BSRect(
        rectA.position.x - rectA.size.width / 2 - inflate,
        rectA.position.y - rectA.size.height / 2 - inflate,
        rectA.size.width + 2 * inflate,
        rectA.size.height + 2 * inflate
    );
    const bsB = new BSRect(
        rectB.position.x - rectB.size.width / 2 - inflate,
        rectB.position.y - rectB.size.height / 2 - inflate,
        rectB.size.width + 2 * inflate,
        rectB.size.height + 2 * inflate
    );

    // Пробуем умный маршрут через route. Если вдруг путь не построился, fallback на L-ломаную.
    const path = route([bsA, bsB], [start, end]);
    return (path && path.length > 1) ? path : shortcutLShape(start, end);
}
