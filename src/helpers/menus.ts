import inquirer from "inquirer";
import { Lugar } from "../models/busquedas";

type MenuData = inquirer.QuestionCollection;
type MenuLugar = {
  value: Lugar | null;
  name: string;
}[];

const name = "respuesta";
const appTitle = "App Clima";

export const leer = async (
  message: string,
  titulo?: string
): Promise<string> => {
  if (titulo) mostrarCabecera(titulo);
  const { respuesta } = await inquirer.prompt({
    type: "input",
    name,
    message,
    validate(val) {
      if (val.length === 0) return "No puedes ingresar nada.";
      return true;
    },
  });

  return respuesta;
};

export const pausar = async (
  message = `Presiona ${"ENTER".red} para continuar...`
): Promise<void> => {
  const question: MenuData = {
    type: "input",
    name,
    message,
  };
  await inquirer.prompt(question);
};

export const principal = async (): Promise<number> => {
  const question: MenuData = {
    type: "list",
    name,
    message: " Selecciona una opción:",
    choices: [
      { value: 1, name: "1. ".yellow.bold + "Buscar cuidad" },
      { value: 2, name: "2. ".yellow.bold + "Historial" },
      { value: 0, name: "0. ".yellow.bold + "Guardar y salir" },
    ],
  };

  mostrarCabecera(`${appTitle}: menú principal`);
  const { respuesta } = await inquirer.prompt(question);
  return respuesta;
};

export const listar = async (): Promise<undefined | boolean> => {
  const question: MenuData = {
    type: "list",
    name,
    message: "Mostrar:",
    choices: [
      { value: undefined, name: "Todas".white },
      { value: true, name: "Completadas".green },
      { value: false, name: "Pendientes".red },
    ],
  };

  mostrarCabecera("Tareas pendientes: listar tareas");
  const { respuesta } = await inquirer.prompt(question);
  return respuesta;
};

export const confirmar = async (message: string): Promise<boolean> => {
  const { respuesta } = await inquirer.prompt({
    type: "confirm",
    name,
    message,
  });
  return respuesta;
};

export const listarLugares = async (
  lugares: Lugar[]
): Promise<Lugar | null> => {
  const choices: MenuLugar = lugares.map((lugar, i) => ({
    value: lugar,
    name: `${i + 1}. `.yellow.bold + `${lugar.nombre}`,
  }));
  choices.unshift({
    value: null,
    name: `${0}. `.yellow.bold + "Cancelar",
  });
  const { respuesta } = await inquirer.prompt({
    type: "list",
    name,
    message: "¿A qué lugar te referías?",
    choices,
  });

  return respuesta;
};

export const listarHistorial = async (
  lugares: Lugar[]
): Promise<Lugar | null> => {
  const choices: MenuLugar = lugares.map((l, i) => ({
    value: l,
    name: `${i + 1}. `.green.bold + l.nombre,
  }));
  choices.unshift({ value: null, name: `${0}. `.green.bold + "Salir" });

  const { respuesta } = await inquirer.prompt({
    type: "list",
    name,
    message: "Selecciona una entrada para ver el clima actual:",
    choices,
  });

  return respuesta;
};

/**
 * # Crear línea separadora.
 * Crea una línea separadora de un largo especificado, o de largo 10 si
 * no este no es especificado.
 * @param largo Largo de la línea separadora. Por defecto es 10.
 * @returns Línea separadora del largo especificado.
 */
const separador = (largo = 10) => {
  let linea = "";

  for (let i = 0; i < largo; i++) {
    linea += "=";
  }

  return linea;
};

/**
 * # Muestra un título
 * Imprime un título por consola al usuario.
 * @param titulo Titulo para mostrar
 */
export const mostrarCabecera = (titulo: string) => {
  const _largoTitulo = titulo.length;

  console.clear();
  console.log(separador(_largoTitulo + 10).yellow);
  console.log(`     ${titulo}     `.yellow.bold);
  console.log(separador(_largoTitulo + 10).yellow, "\n");
};
