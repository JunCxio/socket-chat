let socket = io();

//监听与服务端的连接
socket.on('connect', () => {
  console.log('连接成功!');
  // 向服务器发getHistory来拿消息
  /**
   * 展示历史信息
   */
  socket.emit('getHistory');
});

// 列表list，输入框content，按钮sendBtn
let list = document.getElementById('list'),
  input = document.getElementById('input'),
  sendBtn = document.getElementById('sendBtn');

//================================================================================================================

// 发送消息的方法
function send() {
  let value = input.value;
  if (value) {
    // 发送消息给服务器
    socket.emit('message', value);
    input.value = '';
  } else {
    alert('输入的内容不能为空!');
  }
}
// 点击按钮发送消息
sendBtn.onclick = send;

// 回车发送消息的方法
function enterSend(event) {
  let code = event.keyCode;
  if (code === 13) send();
}
// 在输入框onkeydown的时候发送消息
input.onkeydown = function(event) {
  enterSend(event);
};

//================================================================================================================

// 监听message事件来接收服务端发来的消息
socket.on('message', data => {
  // 创建新的li元素，最终将其添加到list列表
  let li = document.createElement('li');
  li.className = 'list-group-item';
  //给对应元素设置行内样式添加颜色
  li.innerHTML = `
        <p style="color: #ccc;">
            <span class="user" style="color:${data.color}">${data.user}</span>
            ${data.createAt}
        </p>
        <p class="content" style="background:${data.color}">${
    data.content
  }</p>`;
  // 将li添加到list列表中
  list.appendChild(li);
  // 将聊天区域的滚动条设置到最新内容的位置
  list.scrollTop = list.scrollHeight;
});

//================================================================================================================
/**
 * 私聊
 */
function privateChat(event) {
  let target = event.target;
  //拿到对应的用户名
  let user = target.innerHTML;
  //只有class为user的才是目标元素
  if (target.className === 'user') {
    //将@用户名显示在input输入框中
    input.value = `@${user}`;
  }
}

//点击进行私聊
list.onclick = function(event) {
  privateChat(event);
};

//================================================================================================================
/**
 * 加入指定房间
 */
function join(room) {
  socket.emit('join', room);
}

// 监听是否已进入房间
// 如果已进入房间，就显示离开房间按钮
socket.on('joined', room => {
  document.getElementById(`join-${room}`).style.display = 'none';
  document.getElementById(`leave-${room}`).style.display = 'inline-block';
});

//离开房间
function leave(room) {
  socket.emit('leave', room);
}
// 监听是否已离开房间
// 如果已离开房间，就显示进入房间按钮
socket.on('leaved', room => {
  document.getElementById(`leave-${room}`).style.display = 'none';
  document.getElementById(`join-${room}`).style.display = 'inline-block';
});

//================================================================================================================
/**
 * 接受历史信息
 */
socket.on('history', history => {
  // history拿到的是一个数组，所以用map映射成新数组，然后再join一下连接拼成字符串
  let html = history
    .map(data => {
      return `<li class="list-group-item">
            <p style="color: #ccc;"><span class="user" style="color:${
              data.color
            }">${data.user} </span>${data.createAt}</p>
            <p class="content" style="background-color: ${data.color}">${
        data.content
      }</p>
        </li>`;
    })
    .join('');
  list.innerHTML =
    html + '<li style="margin: 16px 0;text-align: center">以上是历史消息</li>';
  // 将聊天区域的滚动条设置到最新内容的位置
  list.scrollTop = list.scrollHeight;
});
