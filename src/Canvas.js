// this is a 2D grid drawing class that utilizes HTML5 Canvas
class Canvas {

    constructor(canvas, width, height, gameManager) {
        this.pixelSize = 3; // every cell is scaled by this factor
        this.gameManager = gameManager;
        this.canvas = canvas;
        this.canvas.style.border = "solid 1px #999";
        this.canvas.style.background = "#f2f2f2";
        this.canvas.width = width * this.pixelSize;
        this.canvas.height = height * this.pixelSize;
        this.context = this.canvas.getContext("2d");
    }

    render(state, flags) {
        for (let i=0;i<flags.length;i++) {
            // this condition prevents making 
            // redundant draw calls for unchanged cells
            if (!flags[i])
                continue;

            this.drawCell(state, i);
        }
    }

    // this is an un-optimized render call that
    // do not check for redundant draw calls
    forceRender(state){
        for (let i=0;i<state.length;i++) {
            this.drawCell(state, i);
        }
    }

    drawCell(state, index) {

        let size = this.pixelSize;
        let [x, y] = this.gameManager.indexToCoordinates(index);
        this.context.fillStyle = "#f2f2f2";
        if (state[index])
            this.context.fillStyle = "#444";

        this.context.fillRect(x * size, y * size, size, size);
    }

    projectClickPosition(e) {

        // first cumulative offset of canvas element is found
        // then that offset is substracted from mouse position 
        // to find relative mouse click coordinates
        let totalOffsetX = 0;
        let totalOffsetY = 0;
        let x = 0;
        let y = 0;
        let currentElement = this.canvas;

        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        } while(currentElement = currentElement.offsetParent)
    
        x = e.pageX - totalOffsetX;
        y = e.pageY - totalOffsetY;

        x = Math.floor(x / this.pixelSize);
        y = Math.floor(y / this.pixelSize);

        return [x, y];
    }

}

export default Canvas;