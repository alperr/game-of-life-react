import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'reactstrap';
import GameOfLife from './GameOfLife'
import Canvas from './Canvas'

function App() {

    const DEFAULT_WIDTH = 250;
    const DEFAULT_HEIGHT = 120;

    let canvasRef = useRef(null);
    let [game, setGame] = useState();
    let [renderer, setRenderer] = useState();
    let [generation, setGeneration] = useState(0);
    let [deadCount, setDeadCount] = useState(DEFAULT_WIDTH * DEFAULT_HEIGHT);
    let [aliveCount, setAliveCount] = useState(0);
    let [width, setWidth] = useState(DEFAULT_WIDTH);
    let [height, setHeight] = useState(DEFAULT_HEIGHT);

    function generateNewBoard() {
        let canvasElement = canvasRef.current;
        let game = new GameOfLife(width, height);
        let renderer = new Canvas(canvasElement, width, height, game);
        setGame(game);
        setRenderer(renderer);
        setState(game.getState());
    }

    function clear() {
        let state = game.resetState()
        setState(state);
        renderer.forceRender(game.currentState);
    }

    function addRandomAliveCells(count) {
        for (let i=0;i<count;i++) {
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            game.addAliveCell(x, y);
        }
        setState(game.getState());
        renderer.forceRender(game.currentState);
    }

    function iterate() {
        let state = game.iterate();
        setState(state);
        renderer.render(state.data, state.renderFlags);
    }

    function setState(state) {
        setGeneration(state.generation);
        setDeadCount(state.deadCount);
        setAliveCount(state.aliveCount);
    }

    function onCanvasClick(e) {
        let [x, y] = renderer.projectClickPosition(e.nativeEvent)
        game.addAliveCell(x, y);
        setState(game.getState());
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
                    <a 
                        className="float-right"
                        href="https://github.com/alperr/game-of-life-react">
                        <Button outline color="primary" size="sm">Source Code | Github</Button>
                    </a>
                    <span>

                    </span>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col">
                    <canvas ref={canvasRef} onClick={onCanvasClick}></canvas>
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
            <div className="d-flex justify-content-center mt-3">
                <small>
                    <span className="mx-3">
                        Generation <b>{generation}</b>
                    </span>
                    <span className="mx-3">
                        Alive Cells <b>{aliveCount}</b>
                    </span>
                    <span className="mx-3">
                        Dead Cells <b>{deadCount}</b>
                    </span>
                </small>
            </div>
        </div>
    );
}

export default App;