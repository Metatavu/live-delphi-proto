/* global window, document, WebSocket, MozWebSocket, $, _*/
(function() {
  'use strict';
  
  $.widget("custom.liveDelphiChart", {
    
    options: {
      ticks: ["---", "--", "-", "-/+", "+","++", "+++"],
      maxX: 6,
      maxY: 6,
      pendingTime: 1000,
      tooltipActive: false
    },
    
    _create : function() {
      this._scatterChart = new Chart(this.element, {
        type: 'line',
        data: {
          datasets: this._getSeries()
        },
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
          onClick: function (event) {
            var canvas = event.target;
            var x = event.layerX;
            var y = event.layerY;
            var chartArea = this._scatterChart.chartArea;

            var chartLeft = chartArea.left;
            var chartRight = chartArea.right;
            var chartTop = chartArea.top;
            var chartBottom = chartArea.bottom;

            var xValue = ((x - chartLeft) / chartRight) * this.options.maxX;
            var yValue = ((y - chartTop) / chartBottom) * this.options.maxY;
            
            $(document.body).liveDelphiClient('sendMessage', {
              'type': 'answer',
              'x': xValue,
              'y': yValue
            });
          }.bind(this),
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
                  return this.options.ticks[value];
                }.bind(this)
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
                  return this.options.ticks[value];
                }.bind(this)
              }
            }]
          }
        }
      });
    },
    
    _convertToRange: function(value, fromLow, fromHigh, toLow, toHigh) {
      var fromLength = fromHigh - fromLow;
      var toRange = toHigh - toLow;
      var newValue = toRange / (fromLength / value);
      if (newValue < toLow) {
        return toLow;
      } else if (newValue > toHigh) {
        return toHigh;
      } else {
        return newValue;
      }
    },
    
    _getColor: function (value, updated) {
      var red = Math.floor(convertToRange(value.x, 0, this.options.maxX, 0, 255));
      var blue = Math.floor(convertToRange(value.y, 0, this.options.maxY, 0, 255));
      var age = new Date().getTime() - updated;
      var opacity = convertToRange(age, 0, this.options.pendingTime, 0, 1);
      
      return "rgba(" + [red, 50, blue, opacity].join(',') + ")";
    },
    
    _getData: function () {
      var x = Math.random() * 6;
      var y = Math.random() * 6;
      return {x: x, y: y};
    },
    
    _getSeries: function() {
      var result = [];
      return result;
    }
    
    
  });
  
  
}).call(this);