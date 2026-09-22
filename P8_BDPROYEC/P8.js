require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
// npm install express

var express = require("express");
var app = express(); //Contenedor de Endpoints o WS Restful
const { MongoClient } = require("mongodb");
var client = 0;

var dbName = "";
var collectionName = "";

// Create references to the database and collection in order to run
// operations on them.
var database = 0;
var collection = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectDB() {
  const uri = "mongodb+srv://yuviamixer111213_db_user:Kv39QDXgxpHKMqvD@cluster0.meslfq3.mongodb.net/?appName=Cluster0";
  client = new MongoClient(uri); 
  await client.connect();
  console.log("Conectado con éxito a MongoDB");
}

function prepareDB() {
  dbName = "myDatabase";
  collectionName = "proyectos";
  database = client.db(dbName);
  collection = database.collection(collectionName);
}

// Endpoint para insertar los 5 proyectos
app.post("/proyectos/insertar", async function (req, res) {
  const misProyectos = [
    { 
      id_externo: "PROY-001", 
      nombre: "Sistema Control", 
      area: "Telecom", 
      integrantes: 2, 
      prioridad: "Alta", 
      activa: true 
    },
    { 
      id_externo: "PROY-002", 
      nombre: "Web Portfolio", 
      area: "Desarrollo", 
      integrantes: 3, 
      prioridad: "Media", 
      activa: false 
    },
    { 
      id_externo: "PROY-003", 
      nombre: "App Redes", 
      area: "Cisco", 
      integrantes: 1, 
      prioridad: "Alta", 
      activa: true 
    },
    { 
      id_externo: "PROY-004", 
      nombre: "Filtros MATLAB", 
      area: "Señales", 
      integrantes: 2, 
      prioridad: "Baja", 
      activa: true 
    },
    { 
      id_externo: "PROY-005", 
      nombre: "Circuito Sumador", 
      area: "Electrónica", 
      integrantes: 4, 
      prioridad: "Alta", 
      activa: true 
    }
  ];

  try {
    const result = await collection.insertMany(misProyectos);
    res.json({ 
      mensaje: "Proyectos guardados", 
      conteo: result.insertedCount,
      ids: result.insertedIds 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/proyectos/ver", async function (req, res) {
  try {
    const listaProyectos = await collection.find({}).toArray();
    res.json(listaProyectos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/proyectos/borrar/:id", async function (req, res) {
  const idABorrar = req.params.id; // Captura el ID de la URL

  try {
    // Usamos deleteOne buscando por el campo id_externo
    const result = await collection.deleteOne({ id_externo: idABorrar });

    if (result.deletedCount === 1) {
      res.json({ mensaje: `Proyecto ${idABorrar} eliminado con éxito` });
    } else {
      res.status(404).json({ mensaje: "No se encontró ningún proyecto con ese ID" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/proyectos/actualizar/:id", async function (req, res) {
  const idABuscar = req.params.id; 
  const nuevoNombre = req.body.nombre; 

  try {
    const result = await collection.updateOne(
      { id_externo: idABuscar }, 
      { $set: { nombre: nuevoNombre } } // 
    );

    if (result.matchedCount === 1) {
      res.json({ mensaje: `Proyecto ${idABuscar} actualizado a: ${nuevoNombre}` });
    } else {
      res.status(404).json({ mensaje: "No se encontró el proyecto para actualizar" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, async function () {
  console.log("Servidor corriendo en puerto 3000");
  try {
    await connectDB(); 
    prepareDB();
  } catch (e) {
    console.error("Error al conectar:", e);
  }
});