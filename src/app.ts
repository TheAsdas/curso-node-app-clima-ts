import dotenv from "dotenv";
import colors from "colors";
import { leer, principal, pausar, listarLugares } from "./helpers/menus";
import { Busqueda } from "./models/busquedas";

colors;
dotenv.config();

const main = async () => {
  Busqueda.leerDb();
  let continuar = true;

  console.log("Capitalizar test:");
  console.log(
    Busqueda.capitalizar([
      "a tu vieja le gusta el pico",
      "aguante el wander",
      "el joni se la come doblada",
    ])
  );
  await pausar();

  while (continuar) {
    switch (await principal()) {
      case 0:
        continuar = false;
        break;

      case 1:
        const lugar = await listarLugares(
          await Busqueda.lugar(await leer("¿Qué lugar quieres buscar?"))
        );

        let clima;
        if (lugar) {
          Busqueda.guardarHistorial(lugar);
          clima = await Busqueda.clima(lugar);
          if (clima) {
            Busqueda.mostrarClima(clima);
          }
        }

        break;

      case 2:
        Busqueda.mostrarHistorial();
        break;
    }

    await pausar();
  }
};

main();
