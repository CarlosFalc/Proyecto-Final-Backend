const socketClient = io();

const chatEmail = document.getElementById("chatEmail");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const msgContainer = document.getElementById("msgContainer");

sendMessage.addEventListener("click",()=>{
    const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if( !validEmail.test(chatEmail.value) ){
		alert(`${chatEmail.value} La dirección ingresada no es válida`);
	}else{ socketClient.emit("message",{
        user:chatEmail.value,
        message:chatInput.value
    });
    chatInput.value = "";
}
});

socketClient.on("msgHistory",(data)=>{
    console.log(data);
    msgContainer.innerHTML = "";
    data.forEach(element => {
        const parrafo = document.createElement("p");
        parrafo.innerHTML = `user: ${element.user} >> message: ${element.message}`;
        msgContainer.appendChild((parrafo));
    });
});