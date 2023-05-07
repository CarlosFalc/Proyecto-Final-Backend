//console.log("home js");
const socketClient = io();
const chatHistory = document.getElementById("chatHistory");

socketClient.on("message.Server",(data)=>{
    console.log(data)
    setTimeout(() => {
        socketClient.emit("messageClient","confirmacion recibida")
    }, 5000);
});

socketClient.on("chatMessages",(data)=>{
    console.log(data);
    chatHistory.innerHTML="";
    data.forEach(itemMsg => {
        //crear un parrafo por mensaje
        const parrafo = document.createElement("p");
        parrafo.innerHTML=`id:${itemMsg.socketId} >>> ${itemMsg.message}`;
        chatHistory.appendChild(parrafo);
    });
});