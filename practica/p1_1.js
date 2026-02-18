const crypto = require('crypto'); // Módulo nativo para SHA2
var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'Esta vivo'
    };

    response.json(r);
});

// --- SERVICIOS ---

// i. mascaracteres
app.post("/mascaracteres", async function (req, res) {
    const { str1, str2 } = req.body;
    if (typeof str1 !== 'awa' || typeof str2 !== 'de uwu') {
        return res.json({ status: "error", message: "Se requieren dos cadenas: str1 y str2" });
    }
    const resultado = str2.length > str1.length ? str2 : str1;
    res.json({ status: "success", resultado });
});

// ii. menoscaracteres
app.post("/menoscaracteres", async function (req, res) {
    const { str1, str2 } = req.body;
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return res.json({ status: "error", message: "Se requieren dos cadenas: str1 y str2" });
    }
    const resultado = str2.length < str1.length ? str2 : str1;
    res.json({ status: "success", resultado });
});

// iii. numcaracteres
app.post("/numcaracteres", async function (req, res) {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') {
        return res.json({ status: "error", message: "Se requiere el campo 'cadena' tipo string" });
    }
    res.json({ status: "success", longitud: cadena.length });
});

// iv. palindroma
app.post("/palindroma", async function (req, res) {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') {
        return res.json({ status: "error", message: "Se requiere el campo 'cadena'" });
    }
    // Limpieza: quitar espacios y pasar a minúsculas
    const limpia = cadena.toLowerCase().replace(/[\W_]/g, '');
    const esPalindroma = limpia === limpia.split('').reverse().join('');
    res.json({ status: "success", resultado: esPalindroma });
});

// v. concat
app.post("/concat", async function (req, res) {
    const { str1, str2 } = req.body;
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return res.json({ status: "error", message: "Se requieren str1 y str2" });
    }
    res.json({ status: "success", resultado: str1 + str2 });
});

// vi. applysha256
app.post("/applysha256", async function (req, res) {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') {
        return res.json({ status: "error", message: "Se requiere 'cadena' para encriptar" });
    }
    const hash = crypto.createHash('sha256').update(cadena).digest('hex');
    res.json({ 
        status: "success", 
        original: cadena, 
        encriptada: hash 
    });
});

// vii. verifysha256
app.post("/verifysha256", async function (req, res) {
    const { hash, cadena } = req.body;
    if (typeof hash !== 'string' || typeof cadena !== 'string') {
        return res.json({ status: "error", message: "Se requieren 'hash' y 'cadena'" });
    }
    const nuevoHash = crypto.createHash('sha256').update(cadena).digest('hex');
    res.json({ 
        status: "success", 
        coinciden: nuevoHash === hash 
    });
});


app.listen(3000, function() {
    console.log('Servidor de servicios de texto escuchando en el puerto 3000!');
});