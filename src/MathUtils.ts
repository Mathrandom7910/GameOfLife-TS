import { Pos } from "./Pos";

export class MathUtils {
    public calcVec(pos: Pos, dir: number, steps: number): Pos {
        return pos.add(Math.cos(dir) * steps, Math.sin(dir) * steps);
    }
}