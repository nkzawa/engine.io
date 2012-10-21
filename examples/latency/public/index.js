/*global SmoothieChart,TimeSeries,eio*/

// helper

function $(id){ return document.getElementById(id); }

// chart

var smoothie;
var time;

function render(){
  if (smoothie) smoothie.stop();
  $('chart').width = document.body.clientWidth;
  smoothie = new SmoothieChart();
  smoothie.streamTo($('chart'), 1000);
  time = new TimeSeries();
  smoothie.addTimeSeries(time, {
    strokeStyle: 'rgb(255, 0, 0)',
    fillStyle: 'rgba(255, 0, 0, 0.4)',
    lineWidth: 2
  });
}

// socket
var socket = new eio.Socket();
var last;
function send(){
  last = new Date;
  socket.send('ping');
  $('transport').innerHTML = socket.transport.name;
}
socket.onopen = function(){
  render();
  window.onresize = render;
  send();
};
socket.onclose = function(){
  smoothie.stop();
  $('latency').innerHTML = 'offline';
};
socket.onmessage = function(){
  var latency = new Date - last;
  $('latency').innerHTML = latency + 'ms';
  time.append(+new Date, latency);
  setTimeout(send, 100);
};
