import { ctx, Game, GameConfig } from "./main";
import { Pos } from "./Pos";

export class Cell extends Pos{
    public renX: number;
    public renY: number;
    private mouseOver: number = 255;
    public isAlive: boolean = false;
    private overing: boolean = false;
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
        if(this.overing) {
            this.mouseOver = Math.max(GameConfig.minLight, this.mouseOver - GameConfig.incAmt);
        } else this.mouseOver = Math.min(GameConfig.maxLight, this.mouseOver + GameConfig.incAmt);
        if(this.mouseOver != GameConfig.maxLight && !this.isAlive) {
            ctx.fillStyle = `rgb(${this.mouseOver}, ${this.mouseOver}, ${this.mouseOver})`;
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
        this.overing = true;
    }

    public mouseOut(): void {
        this.overing = false;
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