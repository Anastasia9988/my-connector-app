// src/components/controls/RectInput.tsx
import React from "react";
import { Rect } from "../../types/types";

type Props = {
    name: string;
    rect: Rect;
    onChange: (rect: Rect) => void;
};

export const RectInput: React.FC<Props> = ({ name, rect, onChange }) => {
    const update = (key: keyof Rect["position"] | keyof Rect["size"], value: number) => {
        if (key === "x" || key === "y") {
            onChange({
                ...rect,
                position: { ...rect.position, [key]: value },
            });
        } else {
            onChange({
                ...rect,
                size: { ...rect.size, [key]: value },
            });
        }
    };

    return (
        <fieldset style={{ marginBottom: 12, border: "1px solid #eee", padding: 8 }}>
            <legend>{name}</legend>
            <label>
                X:&nbsp;
                <input
                    type="number"
                    value={rect.position.x}
                    onChange={e => update("x", Number(e.target.value))}
                    style={{ width: 60 }}
                />
            </label>
            &nbsp;&nbsp;
            <label>
                Y:&nbsp;
                <input
                    type="number"
                    value={rect.position.y}
                    onChange={e => update("y", Number(e.target.value))}
                    style={{ width: 60 }}
                />
            </label>
            &nbsp;&nbsp;
            <label>
                Width:&nbsp;
                <input
                    type="number"
                    value={rect.size.width}
                    min={10}
                    onChange={e => update("width", Number(e.target.value))}
                    style={{ width: 60 }}
                />
            </label>
            &nbsp;&nbsp;
            <label>
                Height:&nbsp;
                <input
                    type="number"
                    value={rect.size.height}
                    min={10}
                    onChange={e => update("height", Number(e.target.value))}
                    style={{ width: 60 }}
                />
            </label>
        </fieldset>
    );
};
