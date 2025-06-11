const ticTacToe = (function (doc) {
  const gameBoard = Array(9).fill("!");
  const players = [];
  const marker = ["X", "O", "Q", "R"];

  const container = doc.querySelector(".container");
  const ticTacToeBox = container.querySelector(".tic-tac-toe-box");
  const inpDefaultName = container.querySelector(".inp-default-name");
  const dialogDisplayResult = container.querySelector(".dialog-display-result");
  const dialogCustomName = container.querySelector(".dialog-custom-name");
  const btnSendDefaultName = container.querySelector(".btn-send-default-name");
  const btnShowDialogCustomName = container.querySelector(".btn-show-dialog-custom-name");
  const btnSendCustomName = dialogCustomName.querySelector(".btn-send-custom-name");
  const btnCloseDialogCustomName = dialogCustomName.querySelector(".btn-close-dialog-custom-name");
  const btnAddMorePlayers = dialogCustomName.querySelector('.add-more-players');
  const displayResult = dialogDisplayResult.querySelector(".display-result");
  const formCustomName = dialogCustomName.querySelector('form')

  btnSendDefaultName.addEventListener("click", getDefaultName);
  ticTacToeBox.addEventListener("click", setPlayerChoice);
  btnShowDialogCustomName.addEventListener('click', getCustomName)
  btnCloseDialogCustomName.addEventListener('click', ()=> dialogCustomName.close())
  btnSendCustomName.addEventListener('click',  sendCustomName)
  btnAddMorePlayers.addEventListener('click', addMorePlayers)


  let minPlayers = 2
  function addMorePlayers(){
    if (minPlayers === marker.length) return;
    const label = document.createElement('label')
    const input = document.createElement('input')
    const span = document.createElement('span')
    const div = document.createElement('div')
    
    label.setAttribute("for", `player-${minPlayers + 1}`);
    label.textContent = `Player ${minPlayers+1}`
    input.id = `player-${minPlayers+1}`
    input.classList.add("player-custom-name");
    span.textContent = '*'

    label.append(span)
    div.append(label, input)
    formCustomName.append(div)
    minPlayers++
  }

  function sendCustomName(){
      const playerCustomNames =
      dialogCustomName.querySelectorAll(".player-custom-name");
      
      playerCustomNames.forEach((playerCustomName)=>{
          addPlayer(playerCustomName.value)
      })

  }

  let isWinner;
  function getDefaultName() {
    if (players.length > 0) return;
    let numOfPlayers = +inpDefaultName.value;
    if (typeof numOfPlayers === "number" && !isNaN(numOfPlayers)) {
      for (let i = 0; i < numOfPlayers; i++) {
        addPlayer();
      }
    }
  }

  function getCustomName(){
    dialogCustomName.show()
  }

  function addPlayer(customName) {
    if (players.length === marker.length) return;
    players.push({
      name: customName || `Player ${players.length + 1}`,
      marker: marker[players.length],
    });
  }

  let i = 0;
  function setPlayerChoice(e) {
    if (players.length === 0 || !e.target.classList.contains("box") || isWinner)
      return;
    let pos = [...ticTacToeBox.children].indexOf(e.target);
    //continue here set the parent not to set any choice
    if (gameBoard[pos] != "!") return;
    // Returns to the first person after the last person has made choice
    if (i === players.length) i = 0;

    gameBoard[pos] = players[i];
    e.target.textContent = players[i].marker;

    // Number of boxes marked by both players
    const numOfChoice = gameBoard.filter((val) => val != "!").length;
    if (numOfChoice > players.length * 2) {
      checkWinner(players[i].marker);
    }
    i++;
  }

  function checkWinner(playerMarker) {
    let markers = gameBoard
      .map((val) => (val.marker ? val.marker : val))
      .join("");
    let playingMarker = players.map((val) => val.marker).join("");
    let reg = new RegExp(
      `\(\(\[${playingMarker}]\)\\2{2}\)\|\(\(\[${playingMarker}]\)\.\.\\4\.\.\\4\)\|\(\(\[${playingMarker}]\)\.\.\.\\6\.\.\.\\6)\|\(\.\.\(\[${playingMarker}]\)\.\.\\8\.\\8\)`,
      "gi"
    );

    // Checks the player marker that first matches the pattern - then wins
    let winner = reg.test(markers)

    if (winner) {
      let winnerDetails = players.find((val) => val.marker === playerMarker);
      displayResult.textContent = `${winnerDetails.name} ( ${winnerDetails.marker} ) won`;
      isWinner = true;
      dialogDisplayResult.show();
    }
  }

  return { addPlayer, setPlayerChoice, players, gameBoard };
})(document);

// ticTacToe.addPlayer("Prince");
// ticTacToe.addPlayer("Grace");

// ticTacToe.setPlayerChoice(9);
// ticTacToe.setPlayerChoice(1);
// ticTacToe.setPlayerChoice(6);
// ticTacToe.setPlayerChoice(4);
// ticTacToe.setPlayerChoice(8);
// ticTacToe.setPlayerChoice(7);
