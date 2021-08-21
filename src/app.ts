import dotenv from "dotenv";
import colors from "colors";
import { leer, principal, pausar, listarLugares } from "./helpers/menus";
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
        const respuesta = await listarLugares(
          await Busqueda.buscarCiudad(await leer("¿Qué lugar quieres buscar?"))
        );
          
        console.log(respuesta);

        break;
    }

    await pausar();
  }
};

main();
