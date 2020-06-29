import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'reactstrap';
import GameOfLife from './GameOfLife'
import Canvas from './Canvas'

function App() {

    const DEFAULT_WIDTH = 250;
    const DEFAULT_HEIGHT = 120;

    let game, renderer;
    let canvasRef = useRef(null);
    let [width, setWidth] = useState(DEFAULT_WIDTH);
    let [height, setHeight] = useState(DEFAULT_HEIGHT);

    function generateNewBoard() {
        let canvas = canvasRef.current; 
        game = new GameOfLife(width, height);
        renderer = new Canvas(canvas, width, height, onCanvasClick, game);
    }

    function clear() {
        game.resetState();
        renderer.forceRender(game.currentState);
    }

    function addRandomAliveCells(count) {
        for (let i=0;i<count;i++) {
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            game.addAliveCell(x, y);
        }
        renderer.forceRender(game.currentState);
    }

    function iterate() {
        let state = game.iterate();
        renderer.render(state.data, state.renderFlags);
    }

    function onCanvasClick(x, y) {
        game.addAliveCell(x, y);
        renderer.forceRender(game.currentState);
    }

    useEffect(()=> {
        generateNewBoard();
    }, []);

    return (
        <div 
            className="container my-2 p-4 bg-white border rounded"
            style={{width:"800px", minWidth:"800px"}}
        >
            <div className="row">
                <div className="col">
                    <Button
                        size="sm float-left"
                        color="primary"
                        onClick={generateNewBoard}
                    >
                        Generate a new Board with dimensions
                    </Button>
                    <span className="btn btn-sm float-left ml-2">Width:</span>
                    <Input 
                        onChange={(e)=>{setWidth(e.target.value)}}
                        bsSize="sm"
                        className="small-input float-left"
                        type="number"
                        min="5"
                        max="250"
                        value={width}
                        placeholder="width">
                    </Input>
                    <span className="btn btn-sm float-left ml-2">Height:</span>
                    <Input 
                        onChange={(e)=>{setHeight(e.target.value)}}
                        bsSize="sm"
                        className="small-input float-left"
                        type="number"
                        min="5"
                        max="250"
                        value={height}
                        placeholder="height">
                    </Input>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col">
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
            <div className="row">
                <small className="text-center w-100 text-muted">
                    <i>You can click over canvas area to add <b>alive</b> cells</i>
                </small>
            </div>
            <div className="row mt-2">
                <div className="col text-center">
                    <Button color="primary" onClick={iterate} size="lg">
                        Iterate
                    </Button>
                </div>
            </div>
            <hr></hr>
            <div className="d-flex justify-content-center mt-2">
                <Button 
                    className="mx-2"
                    size="sm" color="secondary" outline
                    onClick={()=>{addRandomAliveCells(50)}}>
                    Add 50 Random Alive Cells
                </Button>
                <Button 
                    className="mx-2"
                    size="sm" color="secondary" outline
                    onClick={()=>{addRandomAliveCells(2000)}}>
                    Add 2000 Random Alive Cells
                </Button>
                <Button 
                    className="mx-2"
                    size="sm" color="secondary" outline
                    onClick={clear}>
                    Clear Canvas
                </Button>
            </div>
        </div>
    );
}

export default App;