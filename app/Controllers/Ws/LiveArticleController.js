"use strict";

class LiveArticleController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  onMessage(message) {
    this.socket.broadcastToAll("message", message);
  }

  onArticle(article) {
    this.socket.broadcastToAll("article", article);
  }
}

module.exports = LiveArticleController;
