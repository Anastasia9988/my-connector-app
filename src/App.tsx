// src/App.tsx
import React, { useState } from 'react';
import { Rect, ConnectionPoint } from './types/types';
import {Controls} from "./components/controls/Controls";
import CanvasBoard from "./components/canvasBoard/CanvasBoard";

// Начальные параметры
const initialRectA: Rect = {
    position: { x: 150, y: 150 },
    size: { width: 120, height: 80 },
};
const initialRectB: Rect = {
    position: { x: 450, y: 300 },
    size: { width: 140, height: 90 },
};
const initialCPointA: ConnectionPoint = {
    angle: -90,
    point: { x: initialRectA.position.x, y: initialRectA.position.y - initialRectA.size.height / 2 },
};
const initialCPointB: ConnectionPoint = {
    angle:  90,
    point: { x: initialRectB.position.x, y: initialRectB.position.y + initialRectB.size.height / 2 },
};


const App: React.FC = () => {
    const [rectA, setRectA]       = useState<Rect>(initialRectA);
    const [rectB, setRectB]       = useState<Rect>(initialRectB);
    const [cPointA, setCPointA]   = useState<ConnectionPoint>(initialCPointA);
    const [cPointB, setCPointB]   = useState<ConnectionPoint>(initialCPointB);

    return (
        <>
            <Controls
                rectA={rectA}
                rectB={rectB}
                onRectAChange={setRectA}
                onRectBChange={setRectB}
                cPointA={cPointA}
                cPointB={cPointB}
                onCPointAChange={setCPointA}
                onCPointBChange={setCPointB}
            />
            <CanvasBoard
                rectA={rectA}
                rectB={rectB}
                cPointA={cPointA}
                cPointB={cPointB}
                onRectAChange={setRectA}
                onRectBChange={setRectB}
                onCPointAChange={setCPointA}
                onCPointBChange={setCPointB}
            />
        </>
    );
};

export default App;
