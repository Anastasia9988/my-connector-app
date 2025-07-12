export type Point = {
    x: number;
    y: number;
};

export type Size = {
    width: number;
    height: number;
};

export type Rect = {
    position: Point;
    size: Size;
};

export type ConnectionPoint = {
    point: Point;
    angle: 90 | -90 | 0 | 180;
};