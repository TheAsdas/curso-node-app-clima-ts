import axios from "axios";

export class Busqueda {
  static historial: string[];

  constructor() {
    //TODO: leer DB si existe.
  }

  static get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  static async buscarCiudad(lugar: string): Promise<[]> {
    //TODO: realizar petición HTTP
    try {
      const instacia = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
        params: Busqueda.paramsMapbox,
      });

      const respuesta = await instacia.get("");
      console.log(respuesta.data);
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
