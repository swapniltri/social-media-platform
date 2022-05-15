var showChatBox = function(){
    document.querySelector("#chat-wrapper").classList.add("chat--visible");
};

var hideChatBox = function(){
    document.querySelector("#chat-wrapper").classList.remove("chat--visible");
};

var socket = io();
var messages = document.getElementById('chat');
var form = document.getElementById('chatForm');
var input = document.getElementById('chatField');
var userFixed = document.getElementById('userFixed');

form.addEventListener('submit', function (e) {
    console.log("hey i got msg");
    e.preventDefault();
    if (input.value) {
        var obj = { message: input.value, username: userFixed.value };
        socket.emit('chat_message', obj);
        input.value = '';
    }
});

socket.on('chat_message', function (msg) {

    console.log("hey i got msg");

    var item = document.createElement('div');
    if(msg.username==userFixed.value){
        item.classList.add('chat-self');
        item.innerHTML=`<div class="chat-message">
          <div class="chat-message-inner">
            ${msg.message}
          </div>
        </div>
        <img src="https://gravatar.com/avatar/504f20626e89be4f1323e9737bb8c779?s=128" class="chat-avatar avatar-tiny">`
    }
    else{
        item.classList.add('chat-other');
        item.innerHTML = `<a href="/profile/${msg.username}"><img src="https://gravatar.com/avatar/838afbc4de3446a26170d809bb684cf1?s=128" class="avatar-tiny"></a><div class="chat-message"><div class="chat-message-inner"><a href="/profile/${msg.username}"><strong>${msg.username}:</strong></a> ${msg.message}</div></div>`;
    }
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});



document.querySelector("#chat-icon").addEventListener("click",showChatBox);
document.querySelector("#cross-icon").addEventListener("click",hideChatBox);