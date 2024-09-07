const WebSocket = require('ws');
const { exec } = require('child_process');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const request = JSON.parse(message);
    if (request.action === 'start_server') {
      exec('"D:\\01AITools\\CapsWriter-Offline-Windows-64bit\\start_server.exe"', (error, stdout, stderr) => {
        if (error) {
          console.error(`启动服务端失败: ${error}`);
          ws.send('error');
          return;
        }
        console.log(`服务端输出: ${stdout}`);
        ws.send('server_started');
      });
    }
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });
});
