// Seleccionar elementos
let userInput = document.querySelector("#inputText");
let resButton = document.querySelector("#resButton");
const chatBox = document.querySelector(".chat-messages");
const userId = "anon-" + Date.now(); // generar id unico

function displayMessage(msg, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message");
  msgDiv.classList.add(
    sender === "user" ? "chat__message--user" : "chat__message--bot"
  );
  if (sender === "bot") msgDiv.classList.add("chat__message--ia");

  msgDiv.textContent = msgText;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const myMessage = userInput.value;

  if (!myMessage) return false;

  userInputValue = "";

  // anaadir mi mensaje de usuario
  displayMessage(myMessage, "user");

  // crear mensaje de cargando esperando al bot
  displayMessage("Escribiendo...", "bot");

  // enviar la peticion al backend
  const response = await fetch("http:localhost:3000/api/nutri-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userId, // generar id unico
      message: myMessage,
    }),
  });
  // recoger la respuesta y reemplazar por el texto IA
  const data = await response.json();

  // Mostrar mensaje
  const botMessages = chatBox.querySelectorAll(".chat__message--ia");
  const lastBotMessage = botMessages[botMessages.length - 1];

  if (lastBotMsg) {
    lastBotMsg.textContent = data.reply;
    chatBox.scrollTop = chatBox.scrollHeight;
  } else {
    displayMessage(data.reply, "bot");
  }
  // Formatear Resultado
  lastBotMessage.textContent = data.reply;
  // limpiar el input
  userInput.value = "";
}

resButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
