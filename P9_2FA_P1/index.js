require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const { MongoClient } = require("mongodb");
const crypto = require("crypto"); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let client;
let db;
let usersCollection;

// Configuración de conexión
async function connectDB() {
    const uri = "mongodb+srv://yuviamixer111213_db_user:Kv39QDXgxpHKMqvD@cluster0.meslfq3.mongodb.net/?appName=Cluster0";
    client = new MongoClient(uri);
    await client.connect();
    console.log("Conectado con éxito a MongoDB");
}

function prepareDB() {
    const dbName = "myDatabase";
    db = client.db(dbName);
    usersCollection = db.collection("usuarios");
}

app.post("/usuarios/insertar", async function (req, res) {
  const misUsuarios = [
    { usuario: "Jazmin", 
        correo: "jazmin@correo.com", 
        password: "1234awa" },
    { usuario: "Yuvia", 
        correo: "yuvia@correo.com", 
        password: "5678ewe" },
    { usuario: "Dario", 
        correo: "dario@correo.com", 
        password: "9012iwi" },
    { usuario: "Ana", 
        correo: "ana@correo.com", 
        password: "3456owo" },
    { usuario: "Diego", 
        correo: "diego@correo.com", 
        password: "7890uwu" }
  ];

  try {
    //SHA-256 
    const usuariosCifrados = misUsuarios.map(u => {
      const hash = crypto
        .createHash('sha256')
        .update(u.password)
        .digest('hex');
      
      return {
        ...u,
        password: hash, // Reemplazamos la clave plana por el hash
        fecha_creacion: new Date()
      };
    });

    const result = await usersCollection.insertMany(usuariosCifrados);

    res.json({ 
      mensaje: "Usuarios guardados", 
      conteo: result.insertedCount,
      ids: result.insertedIds 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/usuarios/valida_login", async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const usuarioEncontrado = await usersCollection.findOne({ usuario: usuario });

        if (usuarioEncontrado) {
            if (usuarioEncontrado.password === passwordHash) {
                // Resultado Válido
                res.json({
                    resultado: "valido",
                    estado: 1,
                    mensaje: `Acceso concedido para ${usuario}`
                });
            } else {
                // Contraseña incorrecta
                res.json({
                    resultado: "invalido",
                    estado: 0,
                    mensaje: "Contraseña incorrecta"
                });
            }
        } else {
            res.json({
                resultado: "invalido",
                estado: 0,
                mensaje: "El usuario no existe"
            });
        }

    } catch (err) {
        res.status(500).json({ 
            resultado: "error",
            estado: -1,
            mensaje: err.message 
        });
    }
});

// SERVIDOR
app.listen(3000, async () => {
    console.log("Servidor corriendo en puerto 3000");
    try {
        await connectDB();
        prepareDB();
    } catch (e) {
        console.error("Error al iniciar:", e);
    }
});