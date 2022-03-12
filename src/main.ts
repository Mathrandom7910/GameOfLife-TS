import { Cell } from './Cell';
import { Mouse } from './Pos';
import './style.css';
//only render when need to update
export var canvas = <HTMLCanvasElement> document.getElementById("canv"),
ctx = <CanvasRenderingContext2D> canvas.getContext("2d"),
settings = <HTMLDivElement> document.getElementById("settings"),
runCheckBox = <HTMLInputElement> document.getElementById("runSim"),
updateFrameInt = <HTMLInputElement> document.getElementById("updateFrame"),
updateFrameDisp = <HTMLLabelElement> document.getElementById("uFDisp"),
clearBtn = <HTMLButtonElement> document.getElementById("clearBtn");



export enum GameConfig {
  settingSize = 25,
  maxTickCount = 15,
  incAmt = 10,
  minLight = 100,
  maxLight = 200
}

export class Game {
  public cells: Cell[][] = [];
  public mouse: Mouse = new Mouse();
  public fps: number = 0;

  public static cellSize = 20;

  private lastCellOn: Cell = new Cell(0, 0);
  private currentCell: Cell = new Cell(0, 0);
  private isSettingUp: boolean = this.mouse.y < GameConfig.settingSize;
  private isRunning: boolean = false;
  private frameTime: number = 0;
  private lastFrameTime: number = Date.now();
  private tickCount: number = 0;
  private maxTickCount: number = GameConfig.maxTickCount;

  public genCells(killCells: boolean = true) {
    for(let x = 0; x < canvas.width / Game.cellSize; x++) {
      for(let y = 0; y < canvas.height / Game.cellSize; y++) {
        if(!this.cells[x]) this.cells[x] = [];
        if((!killCells) && this.cells[x][y] && this.cells[x][y].isAlive) continue;
        this.cells[x][y] = new Cell(x, y);
      }
    }
  }

  private cullCells(): void {
    for(let x = 0; x < this.cells?.length; x++) {
      for(let y = 0; y < this.cells[x]?.length; y++) {
        if(x * Game.cellSize >= innerWidth || y * Game.cellSize >= innerHeight) this.cells[x].splice(y, 1);
        if(this.cells[x].length == 0) this.cells.splice(x, 1);
      }
    }
  }

  constructor(){
    this.genCells();

    settings.style.height = `${GameConfig.settingSize}px`;
    ctx.fillStyle = "grey";

    clearBtn.onclick = () => {
      this.cells.forEach(cellAr => cellAr.forEach(cell => cell.kill()));
    }

    runCheckBox.oninput = () => {
      this.isRunning = runCheckBox.checked;
    }

    updateFrameInt.oninput = () => {
      this.maxTickCount = parseInt(updateFrameInt.value);
      updateFrameDisp.innerHTML = `Update every ${updateFrameInt.value} frame${this.maxTickCount == 1 ? "" : "s"}`;
    }

    document.onmousemove = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.isSettingUp = this.mouse.y < GameConfig.settingSize;

      if(this.isSettingUp) {
        settings.style.display = "block";
        return;
      } else settings.style.display = "none";

      this.currentCell = this.getMouseCell();
      this.currentCell.mouseIn();
      
      if(!this.currentCell.equals(this.lastCellOn)) {
        this.lastCellOn.mouseOut();
      }

      this.lastCellOn = this.currentCell;
    }

    document.onmousedown = () => {
      if(this.isSettingUp) return;
      this.mouse.isDown = true;
      this.currentCell.press();
    }

    document.onmouseup = () => {
      if(this.isSettingUp) return;
      this.mouse.isDown = false;
      this.currentCell.release();
    }

    document.onwheel = (e) => {
      if(e.deltaY < 0) {
        Game.cellSize += 1
      } else Game.cellSize -= 1;

      this.genCells(false);
      this.cullCells();

      for(let x = 0; x < this.cells.length; x++) {
        for(let y = 0; y < this.cells[x].length; y++) {
          this.cells[x][y].update();
        }
      }
    }

  }

  private getMouseCell() : Cell {
    return this.cells[Math.floor(this.mouse.x / Game.cellSize)][Math.floor(this.mouse.y / Game.cellSize)];
  }

  public async render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.tickCount++;

    this.frameTime = Date.now() - this.lastFrameTime;
    this.lastFrameTime = Date.now();
    this.fps = Math.floor(1000 / this.frameTime);

    ctx.strokeStyle = "darkgrey";
    for(let x = 0; x < this.cells.length; x++) {
      for(let y = 0; y < this.cells[x].length; y++) {
        this.cells[x][y].draw();
      }
    }

    if(this.isRunning && this.tickCount >= this.maxTickCount){
      this.tick();
      this.tickCount = 0;
    } 

    ctx.strokeStyle = "black";
    ctx.fillText(`FPS: ${this.fps}`, 20, 20);
    ctx.strokeText(`FPS: ${this.fps}`, 20, 20);

    requestAnimationFrame(this.render);
  }

  public tick() : void {
    let cellsTog: Cell[] = [];
    for(let x = 0; x < this.cells.length; x++) {
      for(let y = 0; y < this.cells[x].length; y++) {
        const cell: Cell = this.cells[x][y],
        around: number = this.getCellsArround(x, y);

        /*
        1 Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        2 Any live cell with two or three live neighbours lives on to the next generation.
        3 Any live cell with more than three live neighbours dies, as if by overpopulation.
        4 Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        */

        //1
       if(around < 2 && cell.isAlive) {
         cellsTog.push(cell);
         continue;
       }

       //2
       //none

       //3
       if(around > 3 && cell.isAlive) {
        cellsTog.push(cell);
      }

      //4
        if(around == 3 && !cell.isAlive) {
          cellsTog.push(cell);
          continue;
        }
      }
    }
    cellsTog.forEach(cell => cell.press());
  }

  private getCellsArround(x1: number, y1: number): number {
    let cellsAmt: number = 0;
    for(let x = -1; x <= 1; x++) {
      for(let y = -1; y <= 1; y++) {
        if((x == 0 && y == 0) || this.cells[x1 + x] == undefined || this.cells[x1 + x][y1 + y] == undefined) continue;
          if(this.cells[x1 + x][y1 + y].isAlive) {
            cellsAmt++;
          }
      }
    }
    return cellsAmt;
  }
  
}
var game: Game;

(onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  game?.genCells(false);
  ctx.font = "20px Arial";
})();

game = new Game();
game.render = game.render.bind(game)
game.render();

declare global {
  interface Window {
    game: Game
  }
}

window.game = game;