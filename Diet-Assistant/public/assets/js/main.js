// Seleccionar elementos
let userInput = document.querySelector("#inputText");
let resButton = document.querySelector("#resButton");

async function sendMessage() {
  const myMessage = userInput.value;

  if (!myMessage) return false;

  userInputValue = "";

  // anaadir mi mensaje de usuario

  // crear mensaje de cargando esperando al bot

  // enviar la peticion al backend

  // recoger la respuesta y reemplazar por el texto IA

  // limpiar el input
  userInput.value = "";
}

resButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
