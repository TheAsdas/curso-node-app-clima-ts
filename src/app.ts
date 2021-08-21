import dotenv from "dotenv";
import colors from "colors";
import { leer, principal, pausar } from "./helpers/menus";
import { Busqueda } from "./models/busquedas";

colors;
dotenv.config();

const main = async () => {
  let continuar = true;

  while (continuar) {
    switch (await principal()) {
      case 0:
        continuar = false;
        break;
      case 1:
        await Busqueda.buscarCiudad(await leer("¿Que cuidad quieres buscar?"));
        break;
    }

    await pausar();
  }
};

main();
