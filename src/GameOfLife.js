// this class only contains game of life related code
// rendering and user interaction handling don't belong here
class GameOfLife {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cellCount = width * height;
        this.aliveCount = 0;
        this.deadCount = this.cellCount;

        // allocating large memory is avoided in
        // frequently called methods like iterate() addAliveCell()
        // this (possibly) two big arrays are allocated in constructor
        // and re-used like a circular buffer
        this.gameAreaA = new Array(this.cellCount);
        this.gameAreaB = new Array(this.cellCount);

        this.currentState = this.gameAreaA;

        // this array holds a flag per cell
        // which shows state change in that cell
        this.shouldRender = new Array(this.cellCount);
        this.turnCount = 0;
    }

    // this method iterates current game state with
    // game of life rules and returns the new state
    iterate() {
        let currentState = this.gameAreaA;
        let nextState = this.gameAreaB;

        // each turn, arrays A and B are swapped for memory reuse
        if (this.turnCount % 2 === 1){
            currentState = this.gameAreaB;
            nextState = this.gameAreaA;
        }

        this.aliveCount = 0;
        for(let i=0;i<this.cellCount;i++) {

            let isAlive = this.isCellAlive(currentState, i);
            if (isAlive)
                this.aliveCount++;

            nextState[i] = isAlive;

            this.shouldRender[i] = true;
            if (nextState[i] === currentState[i])
                this.shouldRender[i] = false;
        }

        this.currentState = nextState;

        this.deadCount = this.cellCount - this.aliveCount;
        this.turnCount++;

        return {
            "data": this.currentState,
            "renderFlags": this.shouldRender,
        }
    }

    addAliveCell(x, y) {
        let index = this.coordinateToIndex(x, y);
        if (!this.currentState[index])
            this.aliveCount++;
        this.currentState[index] = true;
    }

    resetState() {
        for (let i=0;i<this.currentState.length;i++)
            this.currentState[i] = 0;
    }

    isAnEdgeCell(cellIndex) {
        // first row of game area
        if(cellIndex < this.width)
            return true;

        // last row of game area
        if(cellIndex > this.cellCount - this.width)
            return true;

        // first column of game area
        if(cellIndex % this.height === 0)
            return true;

        // last column of game area
        if(cellIndex % this.height === this.width - 1)
            return true;

        return false;
    }

    isCellAlive(state, cellIndex) {
        if (this.isAnEdgeCell(cellIndex))
            return false;

        // at this point of function we are sure that
        // current cell is not an edge cell
        // hence we can assume that coordinate values
        // x-1, x+1, y-1, y+1 do not overflow game area

        let [x, y] = this.indexToCoordinates(cellIndex);

        // every cell [x, y] has 8 neighbours
        // [x-1, y-1] [x, y-1] [x+1, y-1] [x-1, y]
        // [x+1, y] [x-1, y+1] [x, y+1] [x+1, y+1]
        let neighbours =
        [
            [x-1, y-1], [x, y-1], [x+1, y-1], [x-1, y],
            [x+1, y], [x-1, y+1], [x, y+1], [x+1, y+1]
        ]

        let numberOfLiveNeighbours = 0;
        for (let i=0;i<neighbours.length;i++) {
            let n = neighbours[i];
            if (state[this.coordinateToIndex(n[0], n[1])])
                numberOfLiveNeighbours++;
        }

        if (state[cellIndex]) {
            if(numberOfLiveNeighbours < 2)
                return false;
            else if(numberOfLiveNeighbours > 3)
                return false;
        } else {
            if(numberOfLiveNeighbours !== 3)
                return false;
        }

        return true;
    }

    // game of life is played on a 2d map
    // for the sake of data structure simplicity & cleaner iteration code
    // map data is stored on a 1d array and below utility classes are used
    // for array index <-> map coordinates conversions
    coordinateToIndex(x, y) {
        return y * this.width + x;
    }

    indexToCoordinates(index) {
        let x = index % this.width;
        let y = Math.floor(index / this.width);
        return [x, y];
    }

}

export default GameOfLife;
