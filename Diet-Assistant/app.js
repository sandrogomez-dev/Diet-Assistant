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

// Metodo para hacer peticion a la IA
const generateDiet = async (userResponses) => {
  // crrear el prompt(sistema, indicaciones para la ia.)
  const promptSystem = {
    role: "system",
    content: `Eres un asistente nutricional que ayuda a crear dietas personalizadas.
    El usuario te dara su peso, altura, objetivo, alergias, alimentos que no le gustan y numero de comidas diarias.
    Con esta informacion, crea una dieta semanal equilibrada y saludable.
    el sistema no respondera a ningun otro tipo de preguntas que no sean relacionadas con la nutricion y dietas.`,
  };
  // crear el prompt del usuario
  const promptUser = {
    role: "user",
    content: `Hola, quiero que me ayudes a crear una dieta personalizada para una persona que pesa ${userResponses.peso} 
    kg, mide ${userResponses.altura}
     cm, tiene como objetivo ${userResponses.objetivo},
     tiene las siguientes alergias o restricciones alimentarias: ${userResponses.alergias},
      no le gustan los siguientes alimentos: ${userResponses.no_gusta},
        y quiere hacer ${userResponses.comidas_diarias} comidas diarias.
        Devuelve la dieta en formato tabla markdown con las siguiente columnas:
        Dia, Comida, Ingredientes, Cantidades, Instrucciones.
        y no digas nada mas, solo devuelve la tabla.
        Si el usuario no te manda alguno de los datos, interpretalo tu mismo (por ejemplo si el usuario no me pasa el peso, pero si la altura, usa un peso mas o menos probable.)
        `,
  };

  // hacer peticion a LLM de openai
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [promptSystem, promptUser],
      max_tokens: 1000,
      temperature: 0.7,
    });
    // devolvemos el resultado generado
    const response = completion.choices[0].message.content.trim();
    return response;
    // devolver la respuesta generada por la ia
  } catch (error) {
    console.log(error);
    return res.status(500).json({ reply: "Error al generar la dieta" });
  }
};

// Objeto de almacenamiento temporal de respuestas del usuario
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
    const diet = await generateDiet(userData(userId));

    // recoger la respuesta y darle la dieta al usuario

    // devovler respuesta al usuario
    return res.json({ reply: `Aqui tienes tu dieta: ${diet}` });
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
