import AbstractObserver from "fractable-min/AbstractObserver";

//INTERNAL COMMUNICATION EVENTS
PlayersTransceiver.PlayersUpdate = "player:connected";
PlayersTransceiver.PlayersAction = "player:action";
PlayersTransceiver.PlayersScored = "player:scored";

//EXTERNAL COMMUNICATION EVENTS
PlayersTransceiver.Spawn = "player:spawn";
PlayersTransceiver.Moves = "player:moves";
/**
 * Handle multiplayer avatar actions and communication
 * @extends {AbstractObserver}
 * @param {import("./WebSocketClient").default} wsmp
 */
export default function PlayersTransceiver(wsmp) {
  Object.assign(this, new AbstractObserver());

  const handlePlayersInRoom = (players) => {
    try {
      console.log("PLAYERS_ONLINE", players);
      this.notify(PlayersTransceiver.PlayersUpdate, players);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayerJoin = (players) => {
    try {
      console.log("PLAYER_JOINED", players);
      this.notify(PlayersTransceiver.PlayersUpdate, players);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayerLeft = (players) => {
    try {
      console.log("PLAYER_RETIRED", players);
      this.notify(PlayersTransceiver.PlayersUpdate, players);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayerMove = (screens) => {
    try {
      console.log("PLAYER_MOVE", screens);
      this.notify(PlayersTransceiver.PlayersAction, screens);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayerScore = (screens) => {
    try {
      console.log("PLAYER_SCORE", screens);
      this.notify(PlayersTransceiver.PlayersScored, screens);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayersRiddle = (screens) => {
    try {
      this.notify("players:riddle", screens);
    } catch (error) {
      console.log(error);
    }
  };

  /** start listening to messages from the server */
  const startReception = (socket) => {
    /** pre-scene event: players that are already in */
    socket.on("players:connected", handlePlayersInRoom);
    /** pre-scene/in-scene external event: when a player joins */
    socket.on("player:join", handlePlayerJoin);
    /** pre-scene/in-scene external event: when a player lefts */
    socket.on("player:left", handlePlayerLeft);
    /** WHEN PLAYER MAKES A MOVE */
    socket.on("player:move", handlePlayerMove);
    /** WHEN PLAYER SCORES A MOVE */
    socket.on("players:state", handlePlayerScore);
    /* WHEN RIDDLES ARE REDI */
    socket.on("players:riddle", handlePlayersRiddle);
  };

  /** WHEN PLAYER IS CONNECTED, BEGIN EVENT RECEPTION */
  wsmp.subscribe("evt:conencted", startReception);

  this.initialize = (name) => {
    // I HAVE MY NAME, START DATA EMISSION,
    const socket = wsmp.$socket();
    socket.emit(PlayersTransceiver.Spawn, name);
  };

  this.sendText = (screenId, text) => {
    const socket = wsmp.$socket();
    socket.emit(PlayersTransceiver.Moves, { screenId, text });
  };
}
