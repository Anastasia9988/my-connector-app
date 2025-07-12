// src/features/connector/dataConverter.test.ts
import { dataConverter } from './dataConverter';
import { Rect, ConnectionPoint } from '../../types/types';

jest.mock('@blocksuite/connector', () => ({
    route: () => [{ x: 0, y: 0 }, { x: 1, y: 1 }],
    Rectangle: class {},
}));



describe('dataConverter', () => {
    it('строит прямую или ломаную при вертикали', () => {
        const rectA: Rect = {
            position: { x: 100, y: 100 },
            size: { width: 50, height: 40 },
        };
        const rectB: Rect = {
            position: { x: 100, y: 300 },
            size: { width: 60, height: 50 },
        };
        const cA: ConnectionPoint = {
            angle: 90,
            point: { x: 100, y: 120 }, // низ rectA
        };
        const cB: ConnectionPoint = {
            angle: -90,
            point: { x: 100, y: 275 }, // верх rectB
        };

        const path = dataConverter(rectA, rectB, cA, cB);
        expect(path[0]).toEqual({ x: 100, y: 120 });
        expect(path[path.length - 1]).toEqual({ x: 100, y: 275 });
        expect(path.length).toBeGreaterThanOrEqual(2);
    });

    it('строит прямую или ломаную при разнице по X и Y', () => {
        const rectA: Rect = {
            position: { x: 200, y: 200 },
            size: { width: 60, height: 60 },
        };
        const rectB: Rect = {
            position: { x: 400, y: 400 },
            size: { width: 60, height: 60 },
        };
        const cA: ConnectionPoint = {
            angle: 0,
            point: { x: 230, y: 200 }, // правая грань rectA
        };
        const cB: ConnectionPoint = {
            angle: 180,
            point: { x: 370, y: 400 }, // левая грань rectB
        };

        const path = dataConverter(rectA, rectB, cA, cB);
        expect(path[0]).toEqual({ x: 230, y: 200 });
        expect(path[path.length - 1]).toEqual({ x: 370, y: 400 });
        expect(path.length).toBeGreaterThanOrEqual(2);
    });

    it('кидает ошибку если точка подключения вне грани', () => {
        const rectA: Rect = {
            position: { x: 100, y: 100 },
            size: { width: 50, height: 40 },
        };
        const rectB: Rect = {
            position: { x: 200, y: 300 },
            size: { width: 60, height: 50 },
        };
        // некорректная точка — не на грани!
        const cA: ConnectionPoint = {
            angle: 0,
            point: { x: 100, y: 80 },
        };
        const cB: ConnectionPoint = {
            angle: 90,
            point: { x: 200, y: 325 },
        };

        expect(() => dataConverter(rectA, rectB, cA, cB)).toThrow();
    });
});
