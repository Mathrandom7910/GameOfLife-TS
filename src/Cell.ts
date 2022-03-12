import { ctx, Game } from "./main";
import { Pos } from "./Pos";

export class Cell extends Pos{
    public renX: number;
    public renY: number;
    private mouseOver: boolean = false;
    public isAlive: boolean = false;
    constructor(x: number, y: number){
        super(x, y);
        this.renX = x * Game.cellSize;
        this.renY = y * Game.cellSize;
    }

    public update(): void {
        this.renX = this.x * Game.cellSize;
        this.renY = this.y * Game.cellSize;
    }

    public draw(): void {
        if(this.mouseOver && !this.isAlive) {
            ctx.fillStyle = "grey";
            this.fillRect();
        }
        if(this.isAlive) {
            ctx.fillStyle = "black";
            this.fillRect();
        }
        ctx.strokeRect(this.renX, this.renY, Game.cellSize, Game.cellSize);
    }

    private fillRect(): void {
        ctx.fillRect(this.renX, this.renY, Game.cellSize, Game.cellSize);
    }

    public mouseIn(): void {
        this.mouseOver = true;
    }

    public mouseOut(): void {
        this.mouseOver = false;
    }

    public press(): boolean {
        return this.isAlive = !this.isAlive;
    }

    public kill(): void {
        this.isAlive = false;
    }

    public release(): void {
        //add anim
    }
}