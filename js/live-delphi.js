(function(){
  'use strict';
 
  $(document).ready(function () {
    $(document.body)
      .liveDelphiAuth()
      .liveDelphiAuth('authenticate');
  });
  
  $(document).on('authenticated', function () {
    $(document.body).liveDelphiAuth('join');
  });
  
  $(document).on('joined', function () {
    var sessionId = $(document.body).liveDelphiAuth('sessionId');
    
    $(document.body).liveDelphiClient({
      host: 'localhost',
      port: 8000
    });
    
    $(document.body).liveDelphiClient("joinQuery", sessionId, "2194774e-ebe9-49ce-bc6b-4e28645da40c", function () {
      $(document.body).on("connect", function () {
        $("#chart").liveDelphiChart();
      });

      $(document.body).liveDelphiClient('connect', sessionId);
    });
  });
  
})();
