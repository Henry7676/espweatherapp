var http = require('http');

var fs = require('fs');


var index = fs.readFileSync('index.html');

const SerialPort = require("serialport");

const { ReadlineParser } = require("@serialport/parser-readline");

const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimiter: "\r\n" });




const port = new SerialPort.SerialPort({
  baudRate: 9600

});
//Defined values from ealier
port.pipe(parser);

var app = require('http').createServer(function(req, res){
  res.writeHead(200,{'Content-Type': 'text/html'});
  res.end(index);
});


var io = require('socket.io')(app);

parser.on("data", (data) => {
  console.log(data);
  const dataArray = data.split(","); // Split the data into an array based on the comma (',') delimiter
  if (dataArray.length === 2) {
    const humidity = dataArray[0];
    const temperature = dataArray[1];
    io.emit('data', { humidity, temperature });
  }
});

// Start the HTTP server on port 6900
app.listen(3000);