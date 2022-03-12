import { ctx, Game, GameConfig } from "./main";
import { Pos } from "./Pos";

export class Cell extends Pos{
    public renX: number;
    public renY: number;
    private mouseOver: number = 255;
    public isAlive: boolean = false;
    private overing: boolean = false;
    private size: number = Game.cellSize;
    public isPressed: boolean = false;
    private size1: number = 0;
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

        if(this.isPressed) {
            this.size = Math.min(Game.cellSize + GameConfig.maxSize, this.size + GameConfig.sizeInc);
        } else this.size = Math.max(Game.cellSize, this.size - GameConfig.sizeInc);

        this.size1 = this.size != Game.cellSize ? this.size / 10 : 0;

        if(this.mouseOver != GameConfig.maxLight && !this.isAlive) {
            ctx.fillStyle = `rgb(${this.mouseOver}, ${this.mouseOver}, ${this.mouseOver})`;
            this.fillRect();
        }
        if(this.isAlive) {
            ctx.fillStyle = "black";
            this.fillRect();
        }
        ctx.strokeRect(this.renX - this.size1, this.renY - this.size1, this.size, this.size);
    }

    private fillRect(): void {
        ctx.fillRect(this.renX - this.size1, this.renY - this.size1, this.size, this.size);
    }

    public mouseIn(): void {
        this.overing = true;
    }

    public mouseOut(): void {
        this.overing = false;
    }

    public press(sim = false): boolean {
        if(!sim) this.isPressed = true;
        return this.isAlive = !this.isAlive;
    }

    public kill(): void {
        this.isAlive = false;
    }

    public release(): void {
        this.isPressed = false;
    }
}