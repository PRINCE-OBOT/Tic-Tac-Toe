
const TOTAL_CELLS = 9
const MIN_PLAYERS = 2
const MAX_PLAYERS = 3
const MSS_FOR_ALREADY_ADD_PLAYER = "Already added player";
const MSS_FOR_MARKED_CELL = "The board is marked";
const MSS_FOR_EMPTY_CELL = "No one played yet";

const container = document.querySelector('.container')
const cellContainer = container.querySelector(".cell-container")
const customNameCon = container.querySelector(".custom-name-con");
const customNameForm = customNameCon.querySelector(".custom-name-form");
const dialog = customNameCon.querySelector("dialog");
const displayResult = container.querySelector('.display-result')
const displayResultDialog = container.querySelector(".display-result-dialog");
const displayTurn = container.querySelector('.display-turn')
const removeDisplayResult = container.querySelector(".remove-display-result");

displayTurn.textContent = MSS_FOR_EMPTY_CELL
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

    let activePlayer = -1
    let nextPlayer = 0
    const switchPlayer = () => {
      activePlayer++
      nextPlayer++
      if(activePlayer == players.length) activePlayer = 0
      if(nextPlayer == players.length) nextPlayer = 0
    };
    const getActivePlayer = () => players[activePlayer]; 
    const getNextPlayer = () => players[nextPlayer]
    const resetPlayer = ()=>{
      activePlayer = -1
      nextPlayer = 0
      players.splice(0)
    }
    let isGameEnd 
    const setGameEndToTrue = ()=> isGameEnd = true
    const setGameEndToFalse = ()=> isGameEnd = false
    const getGameStatus = ()=> isGameEnd
    return {addPlayer,getAddPlayer,getActivePlayer,switchPlayer,resetPlayer,setGameEndToTrue,setGameEndToFalse,getGameStatus,getNextPlayer};
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
  )return;
  e.target.textContent = control.getActivePlayer().marker
  displayTurn.textContent = `${control.getActivePlayer().name} ( ${control.getActivePlayer().marker} ) >> ${control.getNextPlayer().name} (${control.getNextPlayer().marker})`
  
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
  displayResultDialog.close()
  displayTurn.textContent = MSS_FOR_EMPTY_CELL
}

function resetPlayer(){
  let isResetPlayer = confirm('Resetting the player will also reset the board, click to continue')
  if(!isResetPlayer) return false
  control.setGameEndToFalse()
  cells.resetBoard()
  control.resetPlayer();
  displayTurn.textContent = 
  [...cellContainer.children].forEach((child)=> child.textContent = '')
  displayResultDialog.close()
  displayTurn.textContent = MSS_FOR_EMPTY_CELL
}


function addMorePlayer(){
  if(customNameCon.querySelectorAll(".custom-input").length === MAX_PLAYERS){
    alert('MAXIMUM PLAYER EXCEED - MAXIMUM OF 3 PLAYERS')
    return;
  } 
  const div = document.createElement('div')
  const label = document.createElement('label')
  const input = document.createElement('input')
  const btn = document.createElement('button')

  label.textContent = 'Player 3:'
  label.setAttribute('for', 'player3')

  input.required = true
  input.id = 'player3'
  input.classList.add('custom-input')

  btn.textContent = 'x'
  btn.classList.add('remove-add-player')
  btn.type = 'button'

  div.append(label, " ",input, btn)
  customNameForm.append(div)
}

function checkIfBoardIsEmpty(){
  let isEmpty = cells.getCellInBoard().every((val) => val === "!");
  if (!isEmpty) {
    if(resetPlayer() === false) return MSS_FOR_ALREADY_ADD_PLAYER;
  }
  if (isEmpty && control.getAddPlayer().length >= MIN_PLAYERS) {
    alert(
      "You have already added players, Click 'Reset Player', then add new player"
    );
    return MSS_FOR_ALREADY_ADD_PLAYER
  }
}

// Event Listener
removeDisplayResult.addEventListener('click', ()=>{
  displayResultDialog.close();
})
customNameCon.addEventListener('click', (e)=>{
  let clickBtn = e.target.className
  const markers = ['X', 'O', 'Q'];
  
  switch(clickBtn){
    case 'submit-custom-name-form' :  (function () {
      const inputs = customNameCon.querySelectorAll(".custom-input");
      if([...inputs].some((input)=> input.textContent.trim() === '')) return
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
      const input = container.querySelector(".input-number-of-player");
      const inpVal = +input.value 
      if(inpVal < MIN_PLAYERS || inpVal > MAX_PLAYERS || typeof inpVal != 'number' || isNaN(inpVal)) return
      if(checkIfBoardIsEmpty() === MSS_FOR_ALREADY_ADD_PLAYER) return
      for(let i = 0; i < inpVal; i++){
        control.addPlayer(`Player ${i+1}`, markers[i], inpVal)
      }
    })()
      break;
    case 'add-more-players' : addMorePlayer()
      break
    case 'remove-add-player' : (function(){
      e.target.closest('div').remove()
    })();
      break;
  }
})
