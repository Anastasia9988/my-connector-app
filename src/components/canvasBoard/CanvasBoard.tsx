// src/components/CanvasBoard/CanvasBoard.tsx
import React, { useRef, useEffect } from 'react';
import { Point, Rect as RectType, ConnectionPoint } from '../../types/types';
import { dataConverter } from '../../features/connector/dataConverter';
import styles from './CanvasBoard.module.css';

export type CanvasBoardProps = {
    rectA: RectType;
    rectB: RectType;
    cPointA: ConnectionPoint;
    cPointB: ConnectionPoint;
    onRectAChange: (rect: RectType) => void;
    onRectBChange: (rect: RectType) => void;
    onCPointAChange: (cp: ConnectionPoint) => void;
    onCPointBChange: (cp: ConnectionPoint) => void;
};

const CanvasBoard: React.FC<CanvasBoardProps> = ({
                                                     rectA,
                                                     rectB,
                                                     cPointA,
                                                     cPointB,
                                                     onRectAChange,
                                                     onRectBChange,
                                                     onCPointAChange,
                                                     onCPointBChange,
                                                 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragging = useRef<{ target: 'A' | 'B' | null; offset: Point }>({
        target: null,
        offset: { x: 0, y: 0 },
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // подгоняем размеры
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // рисуем прямоугольники
            const drawRect = (rect: RectType, fill: string) => {
                const { position, size } = rect;
                ctx.fillStyle = fill;
                ctx.fillRect(
                    position.x - size.width / 2,
                    position.y - size.height / 2,
                    size.width,
                    size.height
                );
            };
            drawRect(rectA, '#3498db');
            drawRect(rectB, '#e74c3c');

            // получаем ломанный маршрут
            const path = dataConverter(rectA, rectB, cPointA, cPointB);

            // рисуем «кончики» и сам маршрут
            ctx.beginPath();
            // от границы A до первой точки пути
            ctx.moveTo(cPointA.point.x, cPointA.point.y);
            ctx.lineTo(path[0].x, path[0].y);
            // остальные сегменты
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x, path[i].y);
            }
            // до границы B
            ctx.lineTo(cPointB.point.x, cPointB.point.y);

            // стили
            ctx.lineWidth = 2;
            ctx.lineCap = 'butt';
            ctx.lineJoin = 'miter';
            ctx.strokeStyle = '#2c3e50';
            ctx.stroke();
        };

        draw();

        // (опционально) чтобы линии перерисовывались при ресайзе:
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [rectA, rectB, cPointA, cPointB]);

    // утилита для перетаскивания
    const contains = (rect: RectType, pt: Point) => {
        const halfW = rect.size.width / 2;
        const halfH = rect.size.height / 2;
        return (
            pt.x >= rect.position.x - halfW &&
            pt.x <= rect.position.x + halfW &&
            pt.y >= rect.position.y - halfH &&
            pt.y <= rect.position.y + halfH
        );
    };
    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => ({
        x: e.clientX,
        y: e.clientY,
    });

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);
        if (contains(rectA, pos)) {
            dragging.current = {
                target: 'A',
                offset: { x: pos.x - rectA.position.x, y: pos.y - rectA.position.y },
            };
        } else if (contains(rectB, pos)) {
            dragging.current = {
                target: 'B',
                offset: { x: pos.x - rectB.position.x, y: pos.y - rectB.position.y },
            };
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dragging.current.target) return;
        const pos = getMousePos(e);
        const newPos = {
            x: pos.x - dragging.current.offset.x,
            y: pos.y - dragging.current.offset.y,
        };

        if (dragging.current.target === 'A') {
            onRectAChange({ ...rectA, position: newPos });
            onCPointAChange({
                angle: cPointA.angle,
                point: {
                    x:
                        newPos.x +
                        (cPointA.angle === 0
                            ? rectA.size.width / 2
                            : cPointA.angle === 180
                                ? -rectA.size.width / 2
                                : 0),
                    y:
                        newPos.y +
                        (cPointA.angle === 90
                            ? rectA.size.height / 2
                            : cPointA.angle === -90
                                ? -rectA.size.height / 2
                                : 0),
                },
            });
        } else {
            onRectBChange({ ...rectB, position: newPos });
            onCPointBChange({
                angle: cPointB.angle,
                point: {
                    x:
                        newPos.x +
                        (cPointB.angle === 0
                            ? rectB.size.width / 2
                            : cPointB.angle === 180
                                ? -rectB.size.width / 2
                                : 0),
                    y:
                        newPos.y +
                        (cPointB.angle === 90
                            ? rectB.size.height / 2
                            : cPointB.angle === -90
                                ? -rectB.size.height / 2
                                : 0),
                },
            });
        }
    };

    const handleMouseUp = () => {
        dragging.current = { target: null, offset: { x: 0, y: 0 } };
    };

    // **важно** — возвращаем JSX из компонента
    return (
        <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
};

export default CanvasBoard;
