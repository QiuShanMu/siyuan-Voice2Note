const WebSocket = require('ws'); // 引入 WebSocket 模块
const axios = require('axios');

function startCapsWriter() {
  // 创建并添加启动服务的按钮
  const startServiceButton = document.createElement('button');
  startServiceButton.textContent = '启动服务';
  startServiceButton.onclick = function() {
    connectWebSocket(); // 使用 WebSocket 连接后端
  };
  document.body.appendChild(startServiceButton);

  // 实时转录按钮
  const realTimeTranscriptionButton = document.createElement('button');
  realTimeTranscriptionButton.textContent = '实时转录';
  realTimeTranscriptionButton.style.display = 'none'; // 初始隐藏
  document.body.appendChild(realTimeTranscriptionButton);

  // 上传文件按钮
  const uploadFileButton = document.createElement('button');
  uploadFileButton.textContent = '上传文件';
  uploadFileButton.style.display = 'none'; // 初始隐藏
  document.body.appendChild(uploadFileButton);
}

function connectWebSocket() {
  const ws = new WebSocket('ws://localhost:3000');

  ws.onopen = function() {
    console.log('Connected to the server');
    ws.send(JSON.stringify({ action: 'start_server' }));
  };

  ws.onmessage = function(event) {
    console.log('Received:', event.data);
    if (event.data === 'server_started') {
      realTimeTranscriptionButton.style.display = 'block';
      uploadFileButton.style.display = 'block';
    }
  };

  ws.onerror = function(error) {
    console.error('WebSocket Error:', error);
  };

  ws.onclose = function() {
    console.log('WebSocket connection closed');
  };
}

function insertTextToNote(text) {
    // 获取当前打开的笔记的ID
    axios.get('http://localhost:6806/api/note/current').then(response => {
        const currentNoteId = response.data.data.id; // 假设返回的数据中包含当前笔记的ID

        // 创建文本块的API URL
        const apiUrl = 'http://localhost:6806/api/block/create';
        const data = {
            parentId: currentNoteId, // 使用当前笔记的ID作为父节点ID
            content: text, // 插入的文本内容
            type: 'Text' // 指定块类型为文本
        };

        // 发送请求创建文本块
        axios.post(apiUrl, data, {
            headers: {
                'Authorization': 'Bearer wf2u3w7f68re8cni' // 确保替换为您的实际访问令牌
            }
        })
        .then(response => console.log('Text block inserted successfully:', response))
        .catch(error => console.error('Failed to insert text block:', error));
    }).catch(error => {
        console.error('Failed to get current note:', error);
    });
}
