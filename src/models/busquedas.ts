import axios from "axios";
import { MapboxResponse } from "../@types/mapbox";
import { principal } from "../helpers/menus";

export interface Lugar {
  id: string;
  nombre: string;
  lon: number;
  lat: number;
}

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

  static async buscarCiudad(lugar: string): Promise<Lugar[]> {
    //TODO: realizar petición HTTP
    try {
      const instacia = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
        params: Busqueda.paramsMapbox,
      });

      const respuesta = await instacia.get<MapboxResponse>("");
      return respuesta.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lon: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
