console.log("home js")
const socketClient = io();

const id = document.getElementById("chatBox");
const sendButton = document.getElementById("sendButton");
const divServices = document.getElementById("divServices");

const sendMessage = ()=>{
    socketClient.emit("message",chatBox.value);
    socketClient.emit("message",prd.value);
    socketClient.emit("message",cod.value);
    socketClient.emit("message",pr.value);
    socketClient.emit("message",stk.value);
    socketClient.emit("message",cat.value);
    socketClient.emit("message",link.value);
    socketClient.emit("message",di.value);
    }

sendButton.addEventListener("click",(e)=>{
    sendMessage()
});

id.addEventListener("keydown",(evt)=>{
    if(evt.key === "Enter"){
        sendMessage()
    }    
});

socketClient.on("addServices",(data)=>{
    console.log(data);
    divServices.innerHTML="";
    data.forEach(itemMsg => {
        //crear un parrafo por mensaje
        const parrafo = document.createElement("p");
        parrafo.innerHTML=`${itemMsg.message}`;
        divServices.appendChild(parrafo);
    });
});
