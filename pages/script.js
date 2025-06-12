const ticTacToe = (function (doc) {
    const gameBoard = Array(9).fill("!");
    const players = [];
    const marker = ["X", "O", "Q"];
    let isWinner, isSetPlayerChoice;

  const container = doc.querySelector(".container");
  const ticTacToeBox = container.querySelector(".tic-tac-toe-box");
  const inpDefaultName = container.querySelector(".inp-default-name");
  const dialogDisplayResult = container.querySelector(".dialog-display-result");
  const dialogCustomName = container.querySelector(".dialog-custom-name");
  const displayResult = dialogDisplayResult.querySelector(".display-result");
  const customNameCon = dialogCustomName.querySelector(".customNameCon");
  const formContainer = container.querySelector(".form-container");
  const displayTurn = container.querySelector(".display-turn")

  ticTacToeBox.addEventListener("click", setPlayerChoice);
  formContainer.addEventListener("click", modifyCustomNameCon);

  function modifyCustomNameCon(e) {
    if (e.target.tagName != "BUTTON") return;
    let clickBtn = e.target.className;

    switch (clickBtn) {
      case "btn-send-custom-name": sendCustomName(e);
        break;
      case "btn-close-dialog-custom-name": dialogCustomName.close();
        break;
      case "add-more-players": addMorePlayers();
        break;
      case "btn-send-default-name": getNumberOfPlayer(e);
        break;
      case "btn-show-dialog-custom-name": showDialogCustomName()
        break;
      case "btn-remove-inp-field": removeInpField(e);
        break;
     case "reset-board" : getResetGameFeedback()
        break;
      default: console.log(clickBtn);
    }
  }

  let isContinue = null
  function showDialogCustomName(){
    if(isWinner || isSetPlayerChoice){
        getResetGameFeedback();
    }
    if(isContinue === false) return
    dialogCustomName.show();
  }

  // keep track when a player has been deleted in the custom name field
  // To maintain order of custom name marker and the marker on the board
  const addedPlayer = [];

  function removeInpField(e) {
    const div = e.target.closest("div");
    let isDelete = confirm(
      "This action cannot be undone - Are you sure you want to delete this field?"
    );
    if (!isDelete) return;
    addedPlayer.splice([...customNameCon.children].indexOf(div), 1);
    div.remove();
  }

  function checkIfInputIsEmpty(e){
    let isEmpty
    e.target.closest('form').querySelectorAll('input').forEach((input)=>{
        if(input.value === ''){
            isEmpty = true
        }
    })
    return isEmpty
  }

  let minPlayers = 2;
  let isAddedPlayer = true;
  function addMorePlayers() {
    if (minPlayers === marker.length) return;
    
    if(isAddedPlayer){
        addedPlayer.splice(0)
        addedPlayer.push(0, 1);
        isAddedPlayer = false
    }
    
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const div = document.createElement("div");
    const btnRemove = document.createElement("button");

    label.setAttribute("for", `player-${marker[minPlayers]}`);
    label.textContent = `Player ${marker[minPlayers]}`;
    input.id = `player-${marker[minPlayers]}`;
    input.classList.add("player-custom-name");
    input.required = true;
    span.textContent = "*";
    btnRemove.textContent = "x";
    btnRemove.type = "button";
    btnRemove.classList.add("btn-remove-inp-field");

    addedPlayer.push(minPlayers);
    label.append(span);
    div.append(label, input, btnRemove);
    customNameCon.append(div);
    minPlayers++;
  }

  function getResetGameFeedback(){
      if(!isSetPlayerChoice){
        alert('No one played yet')
        return
      }
      isContinue = confirm("Your board will be cleared - Do you want to continue?")
      if(isContinue === false) return
      resetGame()
  }

  function sendCustomName(e) {
    if(checkIfInputIsEmpty(e)) return
    if(isAddedPlayer){
        addedPlayer.splice(0)
        isAddedPlayer = false
    }
    const playerCustomNames = dialogCustomName.querySelectorAll(
      ".player-custom-name"
    );
    playerCustomNames.forEach((playerCustomName, i) => {
        addedPlayer.push(i);
        addPlayer(playerCustomName.value, i);
    });
    ticTacToeBox.classList.add('ready-to-play')
  }

  function getNumberOfPlayer(e) {
    if (isWinner || isSetPlayerChoice) {
        getResetGameFeedback()
    }
    if (isContinue === false || players.length > 0 || checkIfInputIsEmpty(e))
      return;

    let numOfPlayers = +inpDefaultName.value;
    if(numOfPlayers > 3 || numOfPlayers < 2 || typeof numOfPlayers !== "number" || isNaN(numOfPlayers)){
        alert('Invalid requirement')
        return
    }
    if (!isAddedPlayer) {
      addedPlayer.splice(0);
      isAddedPlayer = true;
    }
      for (let i = 0; i < numOfPlayers; i++) {
        addedPlayer.push(i);
        addPlayer(null, i);
      }
      ticTacToeBox.classList.add('ready-to-play')
    
  }

  function addPlayer(customName, i) {
      if (players.length === marker.length) return;
      players.push({
          name: customName || `Player ${players.length + 1}`,
          marker: marker[addedPlayer[i]],
        });
  }
  let i = 0
  let j = 1;
  function setPlayerChoice(e) {
    if(!isSetPlayerChoice && players.length > 1){
        isSetPlayerChoice = true
    }
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
    displayTurn.textContent = `${players[i].name} (${players[i].marker}) played >> ${players[j].name} (${players[j].marker})`;
    j++
    if (j === players.length) j = 0;
    i++;
  }

  function checkWinner(playerMarker) {
    let markers = gameBoard
      .map((val) => (val.marker ? val.marker : val))
      .join("");
    let playingMarker = players.map((val) => val.marker).join("");
    let reg = new RegExp(
      `\^\(\(\[${playingMarker}]\)\.\.\\2\.\.\\2\)\|\^\(\.\(\[${playingMarker}]\)\.\.\\4\.\.\\4\)\|\^\(\.\.\(\[${playingMarker}]\)\.\.\\6\.\.\\6\)\|\^\(\(\[${playingMarker}]\)\\8{2}\)\|\^\(\.\.\.\(\[${playingMarker}]\)\\10{2}\)\|\^\(\.{6}\(\[${playingMarker}]\)\\12{2}\)\|\^\(\.\.\([${playingMarker}]\)\.\\14\.\\14\)\|\^\(\(\[${playingMarker}]\)\.{3}\\16\.{3}\\16\)`,
      "gi"
    );
    // Checks the player marker that first matches the pattern - then wins
    let winner = reg.test(markers);

    if (winner) {
      let winnerDetails = players.find((val) => val.marker === playerMarker);
      displayResult.textContent = `${winnerDetails.name} ( ${winnerDetails.marker} ) won`;
      isWinner = true;
      dialogDisplayResult.show();
    } else if([...ticTacToeBox.children].every((child)=> child.textContent != "") && isSetPlayerChoice){
        displayResult.textContent = "It's a tie";
        dialogDisplayResult.show();
    }
  }

  function resetGame() {
    gameBoard.splice(0);
    gameBoard.push(...Array(9).fill("!"));
    [...ticTacToeBox.children].forEach((child) => {
      child.textContent = "";
    });
    players.splice(0);
    addedPlayer.splice(0);
    minPlayers = 2;
    i = 0
    j = 1
    isWinner = false;
    isAddedPlayer = true;
    isSetPlayerChoice = false;
    displayTurn.textContent = "No one played yet"
    ticTacToeBox.classList.remove("ready-to-play");
  }
})(document);

