import axios from "axios";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "fs";

import { mostrarCabecera } from "../helpers/menus";
import { MapboxResponse } from "../@types/mapbox";
import { OpenWeatherResponse } from "../@types/openweather";

export interface Lugar {
  id: string;
  nombre: string;
  lon: number;
  lat: number;
}

export interface Clima {
  nombre: string;
  lon: number;
  lat: number;
  desc: string;
  min: number;
  max: number;
  temp: number;
}

interface Historial {
  historial: Lugar[];
}

export class Busqueda {
  static historial: Lugar[] = [];
  private static dir = "./db";
  private static file = "historial.json";

  constructor() {
    Busqueda.leerDb();
  }

  static capitalizar(frases: string[]) {
    return frases.map((f) => f.replace(/ \w|^\w/g, (c) => c.toUpperCase()));
  }

  static get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  static get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  static async lugar(lugar: string): Promise<Lugar[]> {
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

  static async clima({ lon, lat, nombre }: Lugar): Promise<Clima | null> {
    try {
      const instancia = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
        params: {
          lat,
          lon,
          ...this.paramsOpenWeather,
        },
      });

      const { main, weather } = (await instancia.get<OpenWeatherResponse>(""))
        .data;

      return {
        nombre,
        lon,
        lat,
        desc: weather[0].description,
        max: main.temp_max,
        min: main.temp_min,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static mostrarClima({ nombre, lon, lat, min, max, temp, desc }: Clima) {
    console.clear();
    mostrarCabecera(`App Clima: clima en ${nombre.split(",")[0]}`);
    console.log(`Longitud:`.green.bold, lon);
    console.log(`Latitud:`.green.bold, lat);
    console.log(`T° Mínima:`.green.bold, min, "C°");
    console.log(`T° Máxima:`.green.bold, max, "C°");
    console.log(`Temperatura:`.green.bold, temp);
    console.log(`Clima:`.green.bold, desc);
  }

  static guardarHistorial(lugar: Lugar) {
    // Prevenir duplicados
    if (this.historial.includes(lugar))
      this.historial.splice(this.historial.indexOf(lugar), 1);

    this.historial.unshift(lugar);

    // Limite:
    if (this.historial.length > 5) this.historial.pop();

    //TODO: guardar en json
    this.guardarDb();
  }

  private static guardarDb() {
    const payload = {
      historial: this.historial,
    };

    if (!existsSync(this.dir)) mkdirSync(this.dir);
    writeFileSync(`${this.dir}/${this.file}`, JSON.stringify(payload));
  }

  static leerDb() {
    if (existsSync(`${this.dir}/${this.file}`)) {
      const datosDb = readFileSync(`${this.dir}/${this.file}`, {
        encoding: "utf-8",
      });
      const datosParsed: Historial = JSON.parse(datosDb);

      this.historial = datosParsed.historial;
    }
  }

  static mostrarHistorial() {
    console.clear();
    mostrarCabecera("App Clima: Historial");
    this.historial.forEach((h, i) =>
      console.log(`${i + 1}.`.green.bold, h.nombre)
    );
  }
}
