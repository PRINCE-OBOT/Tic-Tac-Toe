const TOTAL_CELLS = 9
const MIN_PLAYERS = 2
const MSS_FOR_ALREADY_ADD_PLAYER = "Already added player";
const MSS_FOR_MARKED_CELL = "The board is marked";

const container = document.querySelector('.container')
const cellContainer = container.querySelector(".cell-container")
const customNameCon = container.querySelector(".custom-name-con");
const dialog = customNameCon.querySelector("dialog");
const displayResult = container.querySelector('.display-result')
const displayResultDialog = container.querySelector(".display-result-dialog");

const GameController = ()=>{
  const players = []
    
    const addPlayer = (name, marker, numOfPlayers)=>{
      if(players.length >= numOfPlayers) return 
        players.push({
            name, 
            marker
        })
    }
    const getAddPlayer = ()=> players

    let i = -1
    const switchPlayer = () => {
      i++
      if(i == players.length) i = 0
    };
    const getActivePlayer = () => players[i]; 
    const resetPlayer = ()=>{
      i = -1
      players.splice(0)
    }
    let isGameEnd 
    const setGameEndToTrue = ()=> isGameEnd = true
    const setGameEndToFalse = ()=> isGameEnd = false
    const getGameStatus = ()=> isGameEnd
    return {
      addPlayer,
      getAddPlayer,
      getActivePlayer,
      switchPlayer,
      resetPlayer,
      setGameEndToTrue,
      setGameEndToFalse,
      getGameStatus
    };
}
const control = GameController()

const AddCellToBoard = ()=>{
    let board = Array(TOTAL_CELLS).fill('!')
    
    const addCellToBoard = (marker, indOfCell) => {
        if(board[indOfCell] != '!') return MSS_FOR_MARKED_CELL;
        board[indOfCell] = marker
    };

    const getCellInBoard = ()=> board
    const resetBoard = () => (board = Array(TOTAL_CELLS).fill("!"));

    return {addCellToBoard, getCellInBoard, resetBoard}
}
const cells = AddCellToBoard()

cellContainer.addEventListener('click', (e)=>{
  if(e.target.className != 'cell' || control.getAddPlayer().length < MIN_PLAYERS || control.getGameStatus()) return
  const indOfCell = [...cellContainer.children].indexOf(e.target)

  control.switchPlayer()
  if (
    cells.addCellToBoard(control.getActivePlayer(), indOfCell) ===
    MSS_FOR_MARKED_CELL
  )
    return;
  e.target.textContent = control.getActivePlayer().marker
  
  const possibleStepToWin = 5
  let activeCells = cells.getCellInBoard().filter((val) => val != "!").length;
  if (activeCells < possibleStepToWin) return;
  checkWinner(activeCells, control.getActivePlayer())
})

const checkWinner = (activeCells, player)=>{
    let playingMarker = control.getAddPlayer().map((val)=> val.marker).join('')
    const markers = cells.getCellInBoard().map((val)=> val.marker ? val.marker : val).join('')

    let reg = new RegExp(
      `\^\(\(\[${playingMarker}]\)\.\.\\MIN_PLAYERS\.\.\\MIN_PLAYERS\)\|\^\(\.\(\[${playingMarker}]\)\.\.\\4\.\.\\4\)\|\^\(\.\.\(\[${playingMarker}]\)\.\.\\6\.\.\\6\)\|\^\(\(\[${playingMarker}]\)\\8{MIN_PLAYERS}\)\|\^\(\.\.\.\(\[${playingMarker}]\)\\10{MIN_PLAYERS}\)\|\^\(\.{6}\(\[${playingMarker}]\)\\12{MIN_PLAYERS}\)\|\^\(\.\.\([${playingMarker}]\)\.\\14\.\\14\)\|\^\(\(\[${playingMarker}]\)\.{3}\\16\.{3}\\16\)`,
      "gi"
    );

    let isCompleteMatch = reg.test(markers)

    if(isCompleteMatch){
      control.setGameEndToTrue()
       displayResult.textContent = `${player.name} ( ${player.marker} ) won`
       displayResultDialog.show()  
    }  else if(activeCells === TOTAL_CELLS){
      control.setGameEndToTrue()
      displayResult.textContent = "It's a tie"
      displayResultDialog.show()  
    }
}

function resetBoard(){
  control.setGameEndToFalse()
  cells.resetBoard();
  [...cellContainer.children].forEach((child)=> child.textContent = '')
}

function resetPlayer(){
  let isResetPlayer = confirm('Resetting the player will also reset the board, click to continue')
  if(!isResetPlayer) return false
  control.setGameEndToFalse()
  cells.resetBoard()
  control.resetPlayer();
  [...cellContainer.children].forEach((child)=> child.textContent = '')
}

customNameCon.addEventListener('click', (e)=>{
  let clickBtn = e.target.className
  const markers = ['X', 'O', 'Q'];
  
  switch(clickBtn){
    case 'submit-custom-name-form' :  (function () {
      const inputs = customNameCon.querySelectorAll(".custom-input");
      inputs.forEach((input, i) => {
        control.addPlayer(input.value,  markers[i], inputs.length);
      });
    })();
      break;

    case 'add-custom-name' : (function(){
      if(checkIfBoardIsEmpty() == MSS_FOR_ALREADY_ADD_PLAYER) return
      dialog.show()
    })();
      break;

    case 'close-custom-name-form' : dialog.close() 
      break;
    case 'reset-board' : resetBoard()
      break;
    case 'reset-player' : resetPlayer()
      break;
    case 'number-of-player' : (function(){
      if(checkIfBoardIsEmpty() == MSS_FOR_ALREADY_ADD_PLAYER) return
      const input = container.querySelector(".input-number-of-player");
      for(let i = 0; i < +input.value; i++){
        control.addPlayer(input.value, markers[i], +input.value)
      }
    })()
  }
})

function checkIfBoardIsEmpty(){
  let isEmpty = cells.getCellInBoard().every((val) => val === "!");
  if (!isEmpty) {
    resetPlayer();
  }
  if (isEmpty && control.getAddPlayer().length >= MIN_PLAYERS) {
    alert(
      "You have already added players, Click 'Reset Player', then add new player"
    );
    return MSS_FOR_ALREADY_ADD_PLAYER
  }
}