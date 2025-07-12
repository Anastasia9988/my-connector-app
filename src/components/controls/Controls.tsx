// src/components/controls/Controls.tsx
import React from 'react';
import { ConnectionPoint, Rect } from '../../types/types';
import styles from './Controls.module.css';

export type ControlsProps = {
    rectA: Rect;
    rectB: Rect;
    cPointA: ConnectionPoint;
    cPointB: ConnectionPoint;
    onRectAChange: (rect: Rect) => void;
    onRectBChange: (rect: Rect) => void;
    onCPointAChange: (cp: ConnectionPoint) => void;
    onCPointBChange: (cp: ConnectionPoint) => void;
};

const angleOptions: { value: ConnectionPoint['angle']; label: string }[] = [
    { value: 0,    label: 'Right (0°)'  },
    { value: 90,   label: 'Down (90°)' },
    { value: 180,  label: 'Left (180°)' },
    { value: -90,  label: 'Up (-90°)'   },
];

// Функция: по прямоугольнику, углу и offset возвращает корректную точку на грани
function buildPointByRectAndAngle(rect: Rect, angle: ConnectionPoint['angle'], offset: number) {
    const { position, size } = rect;
    switch (angle) {
        case 0:
            return { x: position.x + size.width / 2, y: position.y + offset };
        case 180:
            return { x: position.x - size.width / 2, y: position.y + offset };
        case 90:
            return { x: position.x + offset, y: position.y + size.height / 2 };
        case -90:
            return { x: position.x + offset, y: position.y - size.height / 2 };
        default:
            return position; // fallback
    }
}

// Вычисляем offset для текущей точки (смещение вдоль грани)
const calcOffset = (rect: Rect, cp: ConnectionPoint): number => {
    if (cp.angle === 0 || cp.angle === 180) {
        return cp.point.y - rect.position.y;
    }
    return cp.point.x - rect.position.x;
};

// Границы для слайдера
const getBounds = (rect: Rect, angle: ConnectionPoint['angle']): [number, number] => {
    if (angle === 0 || angle === 180) {
        const halfH = rect.size.height / 2;
        return [-halfH, halfH];
    }
    const halfW = rect.size.width / 2;
    return [-halfW, halfW];
};

const RectInputs: React.FC<{
    rect: Rect;
    onChange: (rect: Rect) => void;
    label: string;
}> = ({ rect, onChange, label }) => (
    <fieldset className={styles.rectInputs}>
        <legend>{label} параметры</legend>
        <label>
            X:
            <input
                type="number"
                value={rect.position.x}
                onChange={e =>
                    onChange({ ...rect, position: { ...rect.position, x: Number(e.target.value) } })
                }
            />
        </label>
        <label>
            Y:
            <input
                type="number"
                value={rect.position.y}
                onChange={e =>
                    onChange({ ...rect, position: { ...rect.position, y: Number(e.target.value) } })
                }
            />
        </label>
        <label>
            Width:
            <input
                type="number"
                min={10}
                value={rect.size.width}
                onChange={e =>
                    onChange({ ...rect, size: { ...rect.size, width: Number(e.target.value) } })
                }
            />
        </label>
        <label>
            Height:
            <input
                type="number"
                min={10}
                value={rect.size.height}
                onChange={e =>
                    onChange({ ...rect, size: { ...rect.size, height: Number(e.target.value) } })
                }
            />
        </label>
    </fieldset>
);

export const Controls: React.FC<ControlsProps> = ({
                                                      rectA, rectB, cPointA, cPointB,
                                                      onRectAChange, onRectBChange, onCPointAChange, onCPointBChange,
                                                  }) => {
    // --- ВАЖНО --- корректно пересчитывать порт при изменении прямоугольника
    const handleRectAChange = (newRect: Rect) => {
        const offset = calcOffset(newRect, cPointA);
        onRectAChange(newRect);
        onCPointAChange({
            angle: cPointA.angle,
            point: buildPointByRectAndAngle(newRect, cPointA.angle, offset)
        });
    };
    const handleRectBChange = (newRect: Rect) => {
        const offset = calcOffset(newRect, cPointB);
        onRectBChange(newRect);
        onCPointBChange({
            angle: cPointB.angle,
            point: buildPointByRectAndAngle(newRect, cPointB.angle, offset)
        });
    };

    // Генерируем новую точку порта (при смене угла/offset)
    const buildConnection = (
        rect: Rect,
        angle: ConnectionPoint['angle'],
        offset: number,
        onChange: (cp: ConnectionPoint) => void
    ) => {
        const point = buildPointByRectAndAngle(rect, angle, offset);
        onChange({ angle, point });
    };

    // Общие обработчики
    const handleAngle = (
        e: React.ChangeEvent<HTMLSelectElement>,
        rect: Rect,
        cp: ConnectionPoint,
        onChange: (cp: ConnectionPoint) => void
    ) => {
        const angle = Number(e.target.value) as ConnectionPoint['angle'];
        const offset = calcOffset(rect, cp);
        buildConnection(rect, angle, offset, onChange);
    };

    const handleOffset = (
        e: React.ChangeEvent<HTMLInputElement>,
        rect: Rect,
        cp: ConnectionPoint,
        onChange: (cp: ConnectionPoint) => void
    ) => {
        const offset = Number(e.target.value);
        buildConnection(rect, cp.angle, offset, onChange);
    };

    const [minA, maxA] = getBounds(rectA, cPointA.angle);
    const [minB, maxB] = getBounds(rectB, cPointB.angle);

    return (
        <div className={styles.controls}>
            <section className={styles.section}>
                <h4>Rectangle A</h4>
                <RectInputs rect={rectA} onChange={handleRectAChange} label="Rectangle A" />
                <label>
                    Angle:
                    <select value={cPointA.angle} onChange={e => handleAngle(e, rectA, cPointA, onCPointAChange)}>
                        {angleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Offset:
                    <input
                        type="range"
                        min={minA}
                        max={maxA}
                        value={calcOffset(rectA, cPointA)}
                        onChange={e => handleOffset(e, rectA, cPointA, onCPointAChange)}
                    />
                    <span className={styles.value}>{calcOffset(rectA, cPointA)}</span>
                </label>
            </section>

            <section className={styles.section}>
                <h4>Rectangle B</h4>
                <RectInputs rect={rectB} onChange={handleRectBChange} label="Rectangle B" />
                <label>
                    Angle:
                    <select value={cPointB.angle} onChange={e => handleAngle(e, rectB, cPointB, onCPointBChange)}>
                        {angleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Offset:
                    <input
                        type="range"
                        min={minB}
                        max={maxB}
                        value={calcOffset(rectB, cPointB)}
                        onChange={e => handleOffset(e, rectB, cPointB, onCPointBChange)}
                    />
                    <span className={styles.value}>{calcOffset(rectB, cPointB)}</span>
                </label>
            </section>
        </div>
    );
};

export default Controls;
