let isWinner;

const Player = () => {
  const players = [];

  const addPlayer = (name, marker) => {
    players.push({
      name,
      marker,
    });
  };
  const getAddPlayer = () => players;

  const setTurn = () => {
    if (players.length >= 2) {
      let activePlayer = players[0];

      const switchPlayer = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
      };
      const getActivePlayer = () => activePlayer;
      return { getActivePlayer, switchPlayer };
    }
  };
  return { addPlayer, getAddPlayer, setTurn };
};
const players = Player();

const AddCellToBoard = () => {
  const board = Array(9).fill("!");

  const addCellToBoard = (marker, indOfCell) => {
    if (board[indOfCell] != "!") return;
    board[indOfCell] = marker;
  };

  const getCellInBoard = () => board;

  return { addCellToBoard, getCellInBoard };
};

const cells = AddCellToBoard();
const checkWinner = () => {
  const possibleStepToWin = 5;

  let playingMarker = players
    .getAddPlayer()
    .map((val) => val.marker)
    .join("");
  let activeCells = cells.getCellInBoard().filter((val) => val != "!").length;

  if (activeCells < possibleStepToWin) return;
  const markers = cells
    .getCellInBoard()
    .map((val) => (val.marker ? val.marker : val))
    .join("");

  let reg = new RegExp(
    `\^\(\(\[${playingMarker}]\)\.\.\\2\.\.\\2\)\|\^\(\.\(\[${playingMarker}]\)\.\.\\4\.\.\\4\)\|\^\(\.\.\(\[${playingMarker}]\)\.\.\\6\.\.\\6\)\|\^\(\(\[${playingMarker}]\)\\8{2}\)\|\^\(\.\.\.\(\[${playingMarker}]\)\\10{2}\)\|\^\(\.{6}\(\[${playingMarker}]\)\\12{2}\)\|\^\(\.\.\([${playingMarker}]\)\.\\14\.\\14\)\|\^\(\(\[${playingMarker}]\)\.{3}\\16\.{3}\\16\)`,
    "gi"
  );

  let isCompleteMatch = reg.test(markers);

  if (isCompleteMatch) {
    console.log("winner");
    // isWinner = true
  } else if (activeCells === 9) console.log("Its a tie");
};
