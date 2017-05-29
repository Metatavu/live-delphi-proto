/* global window, document, WebSocket, MozWebSocket, $, _*/
(function() {
  'use strict';
  
  $.widget("custom.liveDelphiClient", {
    
    options: {
      serverUrl: 'http://localhost:8000',
      reconnectTimeout: 3000,
      host: 'localhost',
      port: 8000
    },
    
    _create : function() {
      this._state = null;
      this._pendingMessages = [];
      this._queryId = null;
    },
    
    connect: function (sessionId) {
      this._state = 'CONNECTING';
      
      this._webSocket = this._createWebSocket(sessionId);
      if (!this._webSocket) {
        // Handle error  
        return;
      } 
      
      switch (this._webSocket.readyState) {
        case this._webSocket.CONNECTING:
          this._webSocket.onopen = $.proxy(this._onWebSocketOpen, this);
        break;
        case this._webSocket.OPEN:
          this._onWebSocketOpen();
        break;
        default:
          this._reconnect();
        break;
      }
      
      this._webSocket.onmessage = $.proxy(this._onWebSocketMessage, this);
      this._webSocket.onclose = $.proxy(this._onWebSocketClose, this);
      this._webSocket.onerror = $.proxy(this._onWebSocketError, this);
    },
    
    sendMessage: function (data) {
      this._sendMessage(data);
    },
    
    joinQuery: function (sessionId, queryId, callback) {
      $.post(this.options.serverUrl + '/joinQuery/' + queryId, {
        sessionId: sessionId
      }, $.proxy(function (data) {
        this._queryId = queryId;
        
        this.sendMessage({
          'type': 'join-query'
        });
        
        callback();
      }, this))
      .fail( $.proxy(function () {
        callback("error");
      }, this));
    },
    
    _reconnect: function () {
      console.log("Reconnecting...");

      if (this._reconnectTimeout) {
        clearTimeout(this._reconnectTimeout);
      }
      
      if (!this._webSocket || this._webSocket.readyState !== this._webSocket.CONNECTING) {
        this.connect();
      }
      
      this._reconnectTimeout = setTimeout($.proxy(function () {
        console.log("timeout socket state: " + this._webSocket.readyState);
        
        if (this._webSocket.readyState === this._webSocket.CLOSED) {
          this._reconnect();
        }
      }, this), this.options.reconnectTimeout);
    },

    _createWebSocket: function (sessionId) {
      var url = 'ws://' + this.options.host + ':' + this.options.port + '/' + sessionId;
      
      if ((typeof window.WebSocket) !== 'undefined') {
        return new WebSocket(url);
      } else if ((typeof window.MozWebSocket) !== 'undefined') {
        return new MozWebSocket(url);
      }
    },
    
    _sendMessage: function (data) {
      if (this._state === 'CONNECTED') {
        this._webSocket.send(JSON.stringify(data));
      } else {
        this._pendingMessages.push(JSON.stringify(data));
      }
    },
    
    _onWebSocketOpen: function (event) {
      while (this._pendingMessages.length) {
        this._webSocket.send(this._pendingMessages.shift());
      }
      
      this._state = 'CONNECTED';
      
      this.element.trigger("connect", { }); 
      
      console.log("Connected");
    },
    
    _onWebSocketMessage: function (event) {
      var message = JSON.parse(event.data);
      this.element.trigger("message", {
        message: message
      }); 
    },
    
    _onWebSocketClose: function (event) {
      console.log("Socket closed");
      this._reconnect();
    },
    
    _onWebSocketError: function (event) {
      console.log("Socket error");
      this._reconnect();
    }
    
  });
  
  
}).call(this);