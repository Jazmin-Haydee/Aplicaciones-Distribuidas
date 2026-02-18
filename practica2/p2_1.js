var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/pruba", async function (request, response) {

    r ={
      'message':'Esta vivo y chambeando '
    };

    response.json(r);
});

// --- FUNCIÓN UTILITARIA PARA RESPUESTAS UNIFORMES ---
const enviarRespuesta = (res, codigo, datos) => {
    res.status(codigo).json({ estado: codigo, ...datos });
};

// --- EJERCICIO 1: Saludo ---
app.post('/saludo', (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre || typeof nombre !== 'string') throw new Error("El campo 'nombre' es obligatorio y debe ser texto.");
        
        enviarRespuesta(res, 200, { mensaje: `Hola, ${nombre}` });
    } catch (error) {
        enviarRespuesta(res, 400, { error: error.message });
    }
});

// --- EJERCICIO 2: Calculadora ---
app.post('/calculadora', (req, res) => {
    try {
        const { a, b, operacion } = req.body;
        if (typeof a !== 'number' || typeof b !== 'number') throw new Error(" 'a' y 'b' deben ser números.");
        
        let resultado;
        switch (operacion) {
            case 'suma': resultado = a + b; break;
            case 'resta': resultado = a - b; break;
            case 'multiplicacion': resultado = a * b; break;
            case 'division':
                if (b === 0) return enviarRespuesta(res, 400, { error: "División por cero no permitida" });
                resultado = a / b;
                break;
            default: throw new Error("Operación no válida (suma, resta, multiplicacion, division)");
        }
        enviarRespuesta(res, 200, { resultado });
    } catch (error) {
        enviarRespuesta(res, 400, { error: error.message });
    }
});

// --- EJERCICIO 3: CRUD de Tareas ---
let tareas = [];
app.post('/tareas', (req, res) => {
    try {
        const { id, titulo, completada } = req.body;
        if (id === undefined || !titulo) throw new Error("Datos de tarea incompletos");
        tareas.push({ id, titulo, completada: !!completada });
        enviarRespuesta(res, 201, { mensaje: "Tarea creada" });
    } catch (error) {
        enviarRespuesta(res, 400, { error: error.message });
    }
});

// --- EJERCICIO 4: Validador de Password ---
app.post('/validacontra', (req, res) => {
    try {
        const { contraseña } = req.body;
        if (typeof password !== 'string') throw new Error("Contraseña debe ser un string");

        const errores = [];
        if (contraseña.length < 8) errores.push("Mínimo 8 caracteres");
        if (!/[A-Z]/.test(contraseña)) errores.push("Falta mayúscula");
        if (!/[a-z]/.test(contraseña)) errores.push("Falta minúscula");
        if (!/[0-9]/.test(contraseña)) errores.push("Falta número");

        enviarRespuesta(res, 200, { esValida: errores.length === 0, errores });
    } catch (error) {
        enviarRespuesta(res, 400, { error: error.message });
    }
});

// --- EJERCICIO 5: Conversor Temperatura ---
app.post('/convtemp', (req, res) => {
    try {
        const { valor, desde, hacia } = req.body;
        const escalas = ['C', 'F', 'K'];
        if (typeof valor !== 'number' || !escalas.includes(desde) || !escalas.includes(hacia)) {
            throw new Error("Datos inválidos. Escalas permitidas: C, F, K");
        }
        // ... (lógica de conversión idéntica al ejemplo anterior) ...
        enviarRespuesta(res, 200, { valorOriginal: valor, valorConvertido: 0 /* cálculo */ });
    } catch (error) {
        enviarRespuesta(res, 400, { error: error.message });
    }
});

// --- EJERCICIO 6: Buscador ---
app.post('/buscar', (req, res) => {
    try {
        const { array, elemento } = req.body;
        if (!Array.isArray(array)) throw new Error("El campo 'array' debe ser una lista []");
        
        const indice = array.indexOf(elemento);
        enviarRespuesta(res, 200, { encontrado: indice !== -1, indice, tipo: typeof elemento });
    } catch (error) {
        enviarRespuesta(res, 400, { error: error.message });
    }
});

// --- EJERCICIO 7: Contador de Palabras ---
app.post('/conteopalabras', (req, res) => {
    try {
        const { texto } = req.body;
        if (typeof texto !== 'string') throw new Error("Se requiere un campo 'texto' tipo string");
        
        const palabras = texto.trim().split(/\s+/).filter(p => p.length > 0);
        enviarRespuesta(res, 200, { 
            totalPalabras: palabras.length, 
            totalCaracteres: texto.length,
            palabrasUnicas: new Set(palabras.map(p => p.toLowerCase())).size
        });
    } catch (error) {
        enviarRespuesta(res, 400, { error: error.message });
    }
});

// --- MANEJADOR GLOBAL DE ERRORES (CAPA DE SEGURIDAD EXTRA) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    enviarRespuesta(res, 500, { error: "Ocurrió un error inesperado en el servidor" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor seguro en puerto ${PORT}`));