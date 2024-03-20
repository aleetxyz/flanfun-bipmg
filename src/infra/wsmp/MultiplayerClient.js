import { io } from "socket.io-client";

import AbstractObserver from "fractable-min/AbstractObserver";

const { VITE_APP_MP_WEBSOCK } = import.meta.env;

/**
 * @singleton
 * @constructor
 * Provides an entry point for multiplayer ws:server.
 */
function MultiplayerClient() {
  Object.assign(this, new AbstractObserver());
  let socket = null;

  this.connect = (sceneId) => {
    if (socket) {
      return;
    }

    const serverUrl = `${VITE_APP_MP_WEBSOCK}/${sceneId}`;
    socket = io(serverUrl);

    socket.on("connect", () => {
      console.log("OK_CONNECTED", socket.id);
    });

    this.notify("evt:conencted", socket);
  };

  this.$socketId = () => socket?.id;
  this.$socket = () => socket;
}

export const client = new MultiplayerClient();
