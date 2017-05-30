(function(){
  'use strict';
  
  $.widget("custom.liveDelphi", {
    
    options: {
      serverUrl: 'http://localhost:8000',
      host: 'localhost',
      port: 8000
    },
    
    _create : function() {
      this.element.on('authenticated', $.proxy(this._onAuthenticated, this));
      this.element.on('joined', $.proxy(this._onJoined, this));
      this.element.on('connect', $.proxy(this._onConnect, this));
      this.element.on('message:answer-changed', $.proxy(this._onMessageAnswerChanged, this));
      
      this.element.liveDelphiClient({
        host: this.options.host,
        port: this.options.port
      });
      
      this.element.liveDelphiAuth();
      
      
      this.element.liveDelphiAuth('authenticate'); 
    },
    
    sessionId: function () {
      return this.element.liveDelphiAuth('sessionId');
    },
    
    joinQuery: function (queryId) {
      this.element.liveDelphiClient("joinQuery", this.sessionId(), queryId);
    },
    
    _onAuthenticated: function () {
      this.element.liveDelphiAuth('join');
    },
    
    _onJoined: function () {
      this.element.liveDelphiClient('connect', this.sessionId());
      // TODO: Move joinQuery call
      this.joinQuery("2194774e-ebe9-49ce-bc6b-4e28645da40c");
    },
    
    _onConnect: function (event, data) {
      $("#chart").liveDelphiChart();
    },
    
    _onMessageAnswerChanged: function (event, data) {
      $("#chart").liveDelphiChart('userData', data.userHash, {
        x: data.x,
        y: data.y
      });
    }
    
  });
  
  $(document).ready(function () {
    $(document.body).liveDelphi();
  });
  
})();
