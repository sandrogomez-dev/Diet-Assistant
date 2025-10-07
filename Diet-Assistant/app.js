//importar dependencias
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

// cargar configuracion(apikey, port)
dotenv.config();

//cargar express
const app = express();
const PORT = process.env.PORT || 3000;
// servir frontend
app.use("/", express.static("public"));

// middleware para procesar json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//instancia de openai y pasar el api key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let userDAta = {};
//ruta /  endpoint / url
app.post("/api/nutri-chat", async (req, res) => {
  console.log(userData);
  //primero se pregunta el peso en el frontend

  //recibir la respuesta del peso del usuario
  const userId = req.body.id;
  const userMessage = req.body.message;

  // Generar objeto del usuario
  if (!userData[userId]) {
    userData[userId] = {};
  }

  if (!userData[userId].peso) {
    userData[userId].peso = userMessage;

    return res.json({ reply: `Cuanto mides? (cm)` });
  }

  if (!userData[userId].altura) {
    userData[userId].altura = userMessage;

    return res.json({
      reply: "Cual es tu objetivo? (perder peso, ganar musculo, mantener)",
    });
  }

  if (!userData[userId].objetivo) {
    userData[userId].objetivo = userMessage;

    return res.json({
      reply: "Tienes alguna alergia o restriccion alimentaria? (si/no)",
    });
  }

  if (!userData[userId].alergias) {
    userData[userId].alergias = userMessage;

    return res.json({ reply: "Que alimentos no te gustan?" });
  }

  if (!userData[userId].no_gusta) {
    userData[userId].no_gusta = userMessage;

    return res.json({ reply: "Cuantas comidas quieres hacer cada dia?" });
  }

  if (!userData[userId].comidas_diarias) {
    userData[userId].comidas_diarias = userMessage;

    // Ejecutar peticion a la ia con un prompt

    // recoger la respuesta y darle la dieta al usuario

    // devovler respuesta al usuario

    return res.json({
      reply: "Gracias por la informacion, generando tu plan de dieta...",
    });
  }

  if (
    userData[userId].peso &&
    userData[userId].altura &&
    userData[userId].objetivo &&
    userData[userId].alergias &&
    userData[userId].no_gusta &&
    userData[userId].comidas_diarias
  ) {
    userData[userId] = {};
    console.log(userData);
  }
});
// Servir el backend
app.listen(PORT, () => {
  console.log("Servidor escuchando en http://localhost:" + PORT);
});
