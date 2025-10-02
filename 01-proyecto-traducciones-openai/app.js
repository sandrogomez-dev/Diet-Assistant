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
app.use("/front", express.static("public"));

app.get("/api", (req, res) => {
  res.json({ message: "¡Funciona!" });
});

// middleware para procesar json
app.use(express.json());

//instancia de openai y pasar el api key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//ruta /  endpoint / url

//funcionalidad de traducir con IA
// LLamar al LLM o modelo de openai

// Servir el backend
app.listen(PORT, () => {
  console.log("Servidor escuchando en http://localhost:" + PORT);
});
