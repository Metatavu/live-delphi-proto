/* global Chartist, bootbox */

(function(){
  'use strict';

  var ticks = ["---", "--", "-", "-/+", "+","++", "+++"];

  var MAX_X = 6;
  var MAX_Y = 6;
  var PENDING_TIME = 1000;
  var tooltipActive = false;

  function openTip(oChart,datasetIndex,pointIndex){
     if(oChart.tooltip._active == undefined)
        oChart.tooltip._active = []
     var activeElements = oChart.tooltip._active;
     var requestedElem = oChart.getDatasetMeta(datasetIndex).data[pointIndex];
     for(var i = 0; i < activeElements.length; i++) {
         if(requestedElem._index == activeElements[i]._index)  
            return;
     }
     activeElements.push(requestedElem);
     oChart.tooltip._active = activeElements;
     oChart.tooltip.update(true);
     oChart.draw();
  }

  function closeTip(oChart,datasetIndex,pointIndex){
     var activeElements = oChart.tooltip._active;
     if(activeElements == undefined || activeElements.length == 0)
       return;
     var requestedElem = oChart.getDatasetMeta(datasetIndex).data[pointIndex];
     for(var i = 0; i < activeElements.length; i++) {
         if(requestedElem._index == activeElements[i]._index)  {
            activeElements.splice(i, 1);
            break;
         }
     }
     oChart.tooltip._active = activeElements;
     oChart.tooltip.update(true);
     oChart.draw();
  }

  function convertToRange(value, fromLow, fromHigh, toLow, toHigh){
    var fromLength = fromHigh - fromLow;
    var toRange = toHigh - toLow;
    var newValue = toRange / (fromLength / value);
    if(newValue < toLow) {
      return toLow;
    } else if (newValue > toHigh) {
      return toHigh;
    } else {
      return newValue;
    }
  }

  function getColor(value, updated) {
    var red = Math.floor(convertToRange(value.x, 0, MAX_X, 0, 255));
    var blue = Math.floor(convertToRange(value.y, 0, MAX_Y, 0, 255));
    var age = new Date().getTime() - updated;
    var opacity = convertToRange(age, 0, PENDING_TIME, 0, 1);
    return "rgba("+red+",50,"+blue+","+opacity+")";
  }

  function getData() {
    var x = Math.random() * 6;
    var y = Math.random() * 6;
    return {x: x, y: y};
  }
  
  function getRandomDataSet() { 
    var data = getData();
    var lastUpdated = new Date().getTime();
    return {showLine: false, data: [ data ], pointBackgroundColor : getColor(data, lastUpdated), pointRadius: 5, lastUpdated: lastUpdated};
  }

  function getSeries() {
    var result = [];
    var length =  20 + (Math.floor(Math.random() * 100));
    for (var i = 0; i < length; i++) {
      result.push(getRandomDataSet());
    }
    return result;
  }
  
  var scatterChartData = {
    datasets: getSeries()
  };
  
  
  var scatterChart = new Chart($("#chart"), {
    type: 'line',
    data: scatterChartData,
    options: {
      tooltips: {
        callbacks: {
          title: function(items, data) {
            return "";
          },
          label: function(item, data) {
            return "Lorem ipsum dolor sit amet...";
          }
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            min: 0,
            max: 6,
            stepSize: 1,
            callback: function(value, index, values) {
              return ticks[value];
            }
          }
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            mirror: true,
            labelOffset: -100,
            min: 0,
            max: 6,
            stepSize: 1,
            callback: function(value, index, values) {
              return ticks[value];
            }
          }
        }]
      }
    }
  });

  function updateChart() {
    var datasetIndex = Math.floor(Math.random() * scatterChartData.datasets.length);
    var dataset = scatterChartData.datasets[datasetIndex];
    var data = getData();
    dataset.lastUpdated = new Date().getTime(),
    dataset.pointBackgroundColor = getColor(data, dataset.lastUpdated);
    dataset.data = [data];
    scatterChart.update();
    
    var showToolTip = Math.random() * 100;
    if(showToolTip > 10 && !tooltipActive) {
      tooltipActive = true;
      setTimeout(function(){
        openTip(scatterChart, datasetIndex, 0);
        setTimeout(function(){
          closeTip(scatterChart, datasetIndex, 0);
          tooltipActive = false;
        }, 3500);
      }, 2000);      
    }
    
    setTimeout(updateChart, Math.random() * 1000);
  }

  updateChart();
  
  setInterval(function(){
    scatterChartData.datasets.forEach(function(dataset) {
      dataset.pointBackgroundColor = getColor(dataset.data[0], dataset.lastUpdated);
    });
    scatterChart.update();
  }, 200);
  
  new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 5,
    loop: true,
    autoplay: 2000,
    autoplayDisableOnInteraction: false
  });
  
  $('.comment-ball').each(function(){
    var ballColor = getColor(getData(), new Date().getTime() - 3000);
    $(this).css('background', ballColor);
  });
  
  $('.comment-container').click(function() {
    var dialog = bootbox.dialog({
      message: '<blockquote class="blockquote"><p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p></blockquote><blockquote class="blockquote blockquote-reverse"><p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p></blockquote><blockquote class="blockquote"><p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p></blockquote><blockquote class="blockquote blockquote-reverse"><p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p></blockquote><blockquote class="blockquote"><p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p></blockquote><blockquote class="blockquote blockquote-reverse"><p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p></blockquote><div class="input-group"><input type="text" class="form-control" placeholder="Kirjoita kommentti..."><span class="input-group-btn"><button class="btn btn-primary" type="button">Lähetä</button></span></div>'
    });
  });
  
})();
