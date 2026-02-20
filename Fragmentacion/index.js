// npm install express

var express = require('express');
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (request, response) {

    r ={
      'message':'Nothing to send'
    };

    response.json(r);
});


// Call this service sending payload in body: raw - json
/*
{
    "id": "pt001",
    "lat": "99.1234567898765",
    "long": "-19.4567654566543"
}
*/
app.post("/fragmentar", async function (req, res) {
  // Extraemos los datos del body
  const cid = req.body.id;
  const clat = req.body.lat;
  const clong = req.body.long;

  // Construimos la respuesta con la estructura anidada (fragmentos)
  const r = {
    "fragmento_1": {
      "id": cid
    },
    "fragmento_2": {
      "lat": clat,
      "long": clong
    }
  };

  // Enviamos la respuesta
  res.json(r);
});

app.listen(3000, function() {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});
