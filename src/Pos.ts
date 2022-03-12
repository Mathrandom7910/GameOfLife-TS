export class Pos {
    public x: number;
    public y: number;
    constructor(x?: number | Pos, y?: number) {

        if(x == undefined || y == undefined) {
            this.x = 0;
            this.y = 0;
            return;
        }

        if(x instanceof Pos) {
            this.x = x.x;
            this.y = x.y;
            return this;
        }

        this.x = x;
        this.y = y;
    }

    public equals(pos : Pos) {
        return this.x == pos.x && this.y == pos.y;
    }

    public clone(): Pos {
        return new Pos(this);
    }

    public add(x: number, y: number): Pos {
        const pos = this.clone();
        pos.x += x;
        pos.y += y;
        return pos;
    }
}

export class Mouse extends Pos {
    public isDown: boolean = false;
    constructor(x?: number, y?: number) {
        super(x, y);
    }
}