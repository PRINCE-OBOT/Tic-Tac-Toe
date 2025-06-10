const ticTacToe = (function () {
  const gameBoard = Array(9);

  const players = [];
  const marker = ["X", "0", "Q", "R", "T"];
  let possibleChanceToWin = 5;

  const addPlayer = (name) => {
    if (players.length === marker.length) return;
    players.push({
      name: name || `Player ${players.length + 1}`,
      marker: marker[players.length],
    });
  };

  let i = 0;
  const setPlayerChoice = (pos) => {
    if (gameBoard[pos - 1] || !pos) return;
    // Returns to the first person after the last person has made choice
    if (i === players.length) i = 0;

    gameBoard[pos - 1] = players[i];
    checkWinner(players[i].marker);
    i++;
  };

  function checkWinner(playerMarker) {
    const numOfChoice = gameBoard.filter((val) => val != false).length;
    if (numOfChoice < possibleChanceToWin) return;
    let chosenPos;
    const chosenPosDif = [];
    // Returns all the index position of the current player
    chosenPos = gameBoard.reduce((acc, cur, ind) => {
      if (cur.marker === playerMarker) acc.push(ind);
      return acc;
    }, []);
    // Subtract current number by the next number to find the difference
    //  - This helps to know when the player marker tally in either direction
    for (let i = chosenPos.length - 1; i > 0; i--) {
      chosenPosDif.push(chosenPos[i] - chosenPos[i - 1]);
    }
    // Checks if their is at least 2 consecutive numbers -then that player win
    if (
      (chosenPosDif
        .sort((a, b) => a - b)
        .toString()
        .match(/(\d+),(\1(,)*)+/g) || [])[0]
    ) {
        console.log(players.find((val)=> val.marker === playerMarker).name)
        console.log(gameBoard)
    }
  }

  return { addPlayer, setPlayerChoice, players, gameBoard };
})();

ticTacToe.addPlayer("Prince");
ticTacToe.addPlayer("Grace");

ticTacToe.setPlayerChoice(9);
ticTacToe.setPlayerChoice(1);
ticTacToe.setPlayerChoice(6);
ticTacToe.setPlayerChoice(4);
ticTacToe.setPlayerChoice(8);
ticTacToe.setPlayerChoice(7);


