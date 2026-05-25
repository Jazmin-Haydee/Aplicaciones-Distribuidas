interface SaludoProps {
  nombre?: string;
  tipo?: string;
}

function Saludo({ nombre, tipo }: SaludoProps) {
  let textoSaludo = "Buenos días"; 

  if (tipo === "noches") {
    textoSaludo = "Buenas noches";
  } else if (tipo === "tardes") {
    textoSaludo = "Buenas tardes";
  }

  return (
    <div>
      <p>
        {textoSaludo}{nombre ? ` ${nombre}` : ""}
      </p>
    </div>
  );
}

export default Saludo;