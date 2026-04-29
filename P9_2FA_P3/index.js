require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const { MongoClient } = require("mongodb");
const crypto = require("crypto"); 
const axios = require("axios"); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN TELEGRAM ---
const TELEGRAM_TOKEN = "8115223571:AAGZ1HhMrfJDtLAo73UnVi4PAedKbjIzhjk";
const TELEGRAM_CHAT_ID = "7927807328"; // Espacio corregido

let client;
let db;
let usersCollection;

// Conexión a MongoDB
async function connectDB() {
    const uri = "mongodb+srv://yuviamixer111213_db_user:Kv39QDXgxpHKMqvD@cluster0.meslfq3.mongodb.net/?appName=Cluster0";
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Conectado con éxito a MongoDB");
}

function prepareDB() {
    const dbName = "myDatabase";
    db = client.db(dbName);
    usersCollection = db.collection("usuarios");
}

// 1. INSERTAR USUARIOS (Carga inicial)
app.post("/usuarios/insertar", async function (req, res) {
    const misUsuarios = [
        { usuario: "Jazmin", correo: "jazmin@correo.com", password: "1234awa" },
        { usuario: "Yuvia", correo: "yuvia@correo.com", password: "5678ewe" },
        { usuario: "Dario", correo: "dario@correo.com", password: "9012iwi" },
        { usuario: "Ana", correo: "ana@correo.com", password: "3456owo" },
        { usuario: "Diego", correo: "diego@correo.com", password: "7890uwu" }
    ];

    try {
        const usuariosCifrados = misUsuarios.map(u => {
            const hash = crypto.createHash('sha256').update(u.password).digest('hex');
            return { ...u, password: hash, fecha_creacion: new Date() };
        });
        const result = await usersCollection.insertMany(usuariosCifrados);
        res.json({ mensaje: "Usuarios guardados", conteo: result.insertedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. VALIDA LOGIN + TOKEN + TELEGRAM
app.post("/usuarios/valida_login", async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // Proceso HASH
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        // Búsqueda
        const usuarioEncontrado = await usersCollection.findOne({ usuario: usuario });

        if (usuarioEncontrado && usuarioEncontrado.password === passwordHash) {
            
            // Generar TOKEN aleatorio de 4 dígitos
            const miToken = Math.floor(1000 + Math.random() * 9000).toString();

            // Mensaje para Telegram
            const mensajeTelegram = `🔐 *Alerta de Seguridad*\n\nHola *${usuario}*,\nTu código de acceso es: \`${miToken}\`\n\n_Si no solicitaste esto, ignora este mensaje._`;
            
            // Envío a Telegram
            try {
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: mensajeTelegram,
                    parse_mode: "Markdown"
                });
            } catch (e) {
                console.error("❌ Error de Telegram:", e.message);
            }

            res.json({
                resultado: "valido",
                estado: 1,
                token: miToken,
                mensaje: "Acceso correcto. Revisa Telegram."
            });

        } else {
            res.json({ resultado: "invalido", estado: 0, mensaje: "Credenciales incorrectas" });
        }
    } catch (err) {
        res.status(500).json({ resultado: "error", estado: -1, mensaje: err.message });
    }
});

// INICIO DEL SERVIDOR
app.listen(3000, async () => {
    console.log("🚀 Servidor en puerto 3000");
    try {
        await connectDB();
        prepareDB();
    } catch (e) {
        console.error("❌ Error al iniciar:", e);
    }
});