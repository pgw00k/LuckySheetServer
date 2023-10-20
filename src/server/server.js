const ws = require('ws');
const express = require('express');
const http = require('http');
const pako = require('pako');
const lsh = require('./LuckysheetHandler.js');

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({
	server
});
const port = process.env.PORT || 8080;

// 设置静态文件路径
app.use(express.static('./Luckysheet/dist'));

// 设置解析
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

wss.on('connection', (socket,req) => {
	console.log(`${req.socket.remoteAddress} conneted.`);
	socket.on('message', function(data, isbin) {
		OnWSMessage(socket, data, isbin);
	});
});

server.listen(port, function() {
	console.log(`Server run on ${port}`);
});

app.use("/luckysheet/api/load", LoadGrid);

function LoadGrid(req, res, next) {

	// let s1 = {
	// 	name: "Sheet1",
	// 	color: "",
	// 	status: 1,
	// 	order: 0,
	// 	data: [],
	// 	config: {},
	// 	index: 0
	// }
	
	let s1={
			color: "",
			status: 1,
			order: 0,
			data: [],
			config: LuckysheetHandler.Config,
			index: 0
	}
	
	res.send(JSON.stringify([s1]));
}


const LuckysheetHandler = new lsh.LuckysheetHandler();

function OnWSMessage(socket, rawData, isBinary) {

	// 检测是否是心跳包
	let isHeartPeak = rawData=='rub';
	if (isHeartPeak)
	{
		return;
	}
	
	let data = rawData;
	data = JSON.parse( decodeURIComponent(pako.ungzip(data.toString(),{to:'string'})) );
	console.log(data);
	LuckysheetHandler.TypeRouter(data);
}