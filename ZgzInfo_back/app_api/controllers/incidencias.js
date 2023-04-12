const axios = require('axios');
const mongoose = require('mongoose');
const Incidencia = mongoose.model('Incidencia');
const user = mongoose.model('Usuario');

/*
// GET /api/incidencias
const incidenciasLista =  async (req, res) => {
  try {
    // Hacer la petición HTTP a la fuente de datos
    const response = await axios.get('https://www.zaragoza.es/sede/servicio/via-publica/incidencia');

    // Extraer todas las incidencias¿?
    //const incidencias = response.data.filter(incidencia => incidencia.tipo === 'TRAFICO');

    // Enviar la lista de incidencias como respuesta
    res.send(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};*/

// GET /api/incidencias
const incidenciasLista =  async (req, res) => {
  try {
    // Hacer la petición HTTP a la fuente de datos
    const response = await axios.get('https://www.zaragoza.es/sede/servicio/via-publica/incidencia');

    // Guardar las incidencias en la base de datos
    //await Incidencia.create(response.data);

    // Enviar la lista de incidencias como respuesta
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// GET /api/incidencias/:calle
const incidenciasLisatCalle =  async (req, res) => {
    try {
      const calle_par = req.params.calle;
      // Hacer la petición HTTP a la fuente de datos
      const response = await axios.get('https://www.zaragoza.es/sede/servicio/via-publica/incidencia');
      
     // const filtradas = response.data.result.filter(incidencia => incidencia.includes(calle_par.toUpperCase()));
      const filtradas = response.data.result.filter(incidencia => incidencia.calle.includes(`${calle_par}`));


      res.send(filtradas);
      
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  // GET /api/mapa
const incidenciasMapa =  async (req, res) => {
  try {
    // Hacer la petición HTTP a la fuente de datos
    const response = await axios.get('https://www.zaragoza.es/sede/servicio/via-publica/incidencia/conservacion-hoy');
    
    // Guardar los puntos de las incidencias  en la base de datos
    //await Incidencia.create(response.data)

    console.log(`cordenadas  ${response.data.result[1].geometry}`);
    // Enviar la lista de puntos de las  incidencias como respuesta
    res.send(response.data.result.map((incidencia) => incidencia.geometry));

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};


// GET /api/mapa/:tipo
const incidenciasMapaTipo =  async (req, res) => {
  try{
    const tipo = req.params.tipo;
    console.log(`tipo  ${tipo}`);
    // Hacer la petición HTTP a la fuente de datos
    const response = await axios.get('https://www.zaragoza.es/sede/servicio/via-publica/incidencia/conservacion-hoy');
   
   /*
   if ( `${response.data.result[1].tipo.title}` === `${tipo}` ){
     //const filtradas = response.data.result.filter(incidencia => incidencia.tipo.title.includes(`${tipo}`));
     console.log(`tipossssss  ${response.data.result[1].tipo.id}`);
   }*/
   

   const filtradas = response.data.result.filter(incidencia => incidencia.tipo.title  === (`${tipo}`));
   console.log(`filtradas  ${filtradas[1].geometry.type}`);
   
   res.send(filtradas.map(incidencia => incidencia.geometry));

  } catch (error) {
      console.error(error);
      res.status(500).send(error);
  }
};
// POST /api/incidencias/{incidenciaId}/suscribir
const suscribirIncidencia =  async (req, res) => {
  try{
    const incidenciaId = req.params.incidenciaId;
    const userId = req.params.userId;
    console.log(`id de incidencia   ${incidenciaId}`);
    console.log(`id de usuario   ${userId}`);

      // Buscar la incidencia por su ID
      const incidencia = await Incidencia.findById(incidenciaId);
  
      if (!incidencia) {
        return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
      }
  
    // Buscar el usuario por su ID
    const usuario = await user.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  
      // Agregar el usuario a la lista de suscritos de la incidencia
      incidencia.suscritos.push(usuario);
      // Guardar los cambios en la base de datos
      await incidencia.save();
      res.json({ mensaje: 'El usuario se ha suscrito a la incidencia exitosamente' });


  } catch (error) {
      console.error(error);
      res.status(500).send(error);
  }
};



  module.exports = {
    incidenciasLista,
    incidenciasLisatCalle,
    incidenciasMapa,
    incidenciasMapaTipo,
    suscribirIncidencia
  };
  
  
  
  
  