/*----- constants -----*/
const SYMBOLS = {
    '0':{CHOICE:' '},
    '1':{
        PLAYER:'Player 1',
        CHOICE:'O',
    },
    '-1':{
        PLAYER:'Player 2',
        CHOICE:'X',
    },
}

/*----- state variables -----*/
let board;
let turn;
let winner;
let size;
let cell;

/*----- cached elements  -----*/
const msgEl = document.querySelector('h1'); 
const playAgainBtn = document.querySelector('button');
const divArray = [...document.querySelectorAll('.box')] //created an array with all the div elements
//const divEl = document.querySelector('#board > div');
const boxes = Array.from(document.getElementsByClassName('box'));

/*----- event listeners -----*/
document.querySelector('#board').addEventListener('click', markBox); //Delegation Event: I add an event listener to the Parent element (#board) of my divs
playAgainBtn.addEventListener('click', init);


/*----- functions -----*/
init();

function init() {
    board = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];
    turn = 1;
    winner = null;
    size = board.length*board[0].length;
    boxes.forEach(function(box) {
        box.style.backgroundColor = 'lightgray'; //reset background color. Used only is CHOICE is set to color
    });     
    render();
};



//identifies which elemnt in the array is being clicked
function markBox(event) {
   const rowIdx = event.target.id.slice(3,4); //get the row index from the target ID
   const colIdx = event.target.id.slice(1,2); //get the column index from the target ID
   if (rowIdx === 'r') return; //guard
   let chosenSquare = board[rowIdx][colIdx]
   if (chosenSquare === 0) {
    board[rowIdx][colIdx] = turn;
    } else {
        return;
    }
   turn *= -1;
   size--;
   //console.log(size);
   winner = getWinner(parseInt(colIdx), parseInt(rowIdx));
   console.log(size)
   render();
}

//----- Check for Winner START -----
function getWinner(colIdx, rowIdx) {
    return size === 0 ? 'T' :
    checkVerticalWin(colIdx, rowIdx) || checkHorizontalWin(colIdx, rowIdx) || checkDiagonalWin(colIdx, rowIdx);
}

  function checkVerticalWin(colIdx, rowIdx) {
    const adjCountUp = countAdjacent(colIdx, rowIdx, 0, 1);
    const adjCountDown = countAdjacent(colIdx, rowIdx, 0, -1);
    //console.log(adjCountUp);
    return (adjCountUp + adjCountDown) === 2 ? board[rowIdx][colIdx] : null;
  }

  function checkHorizontalWin(colIdx, rowIdx) {
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
    return (adjCountLeft + adjCountRight) === 2 ? board[rowIdx][colIdx] : null; 
  }

  function checkDiagonalWin(colIdx, rowIdx) {
    const adjCountLeftDown = countAdjacent(colIdx, rowIdx, -1, -1);
    const adjCountRightDown = countAdjacent(colIdx, rowIdx, 1, -1);
    const adjCountLeftUp = countAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountRightUp = countAdjacent(colIdx, rowIdx, 1, 1);
    return ((adjCountLeftDown + adjCountRightUp) || (adjCountRightDown + adjCountLeftUp)) === 2 ? board[rowIdx][colIdx] : null;
  }

  function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    const player = board[rowIdx][colIdx]; // Shortcut variable to the player value at that stage in the game
    //console.log(player)
    let count = 0; // Track count of adjacent cells with the same player value;
    colIdx += colOffset; // Initialize new coordinates to check the victory condition 
    rowIdx += rowOffset;
    while (
        board[rowIdx] !== undefined && //ensure colIdx is within bounds of the board array
        board[rowIdx][colIdx] !== undefined && //ensure the rowIdx is witin bounds of the board
        board[rowIdx][colIdx] === player //ensure the player number is the same throughout the whole while loop
    ) {
        count++;
        colIdx += colOffset;
        rowIdx += rowOffset;
        console.log(count);
    }
    //console.log(board[rowIdx])
    //console.log(count);
    return count;
}
// ----- Check for Winner ENDS ------ 


//Visualize all state in the DOM
function render() {
    renderBoard();
    renderMessage();
    renderControls()
};

//Update the Sate of the Board in the DOM
function renderBoard () {
    board.forEach(function(rowArr, rowIdx){
        rowArr.forEach(function(cellVal, colIdx){
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.innerText = SYMBOLS[cellVal].CHOICE; //change color of quare
            //cellEl.style.display = hidden;
        })
    })
}

function renderMessage() {
    if (winner === 'T') {
        msgEl.innerText = "No Contest"
    } else if (winner) {
        msgEl.innerText = `${SYMBOLS[winner].PLAYER} Wins!!`
    } else {
        msgEl.innerText = `${SYMBOLS[turn].PLAYER}, you go!`
    }

}

function renderControls() {
    playAgainBtn.style.visibility = winner ? 'visible':'hidden';
}