import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  // Aquí puedes poner tus datos reales
  const datosAlumno = {
    nombre: "Mulato Romero Jzmin Haydee",
    boleta: "2022640220",
  };

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        
        <div>
          <h1>Datos del Alumno</h1>
          <div className="info-container" style={{ textAlign: 'left', marginTop: '20px' }}>
            <p><strong>Nombre:</strong> {datosAlumno.nombre}</p>
            <p><strong>Boleta:</strong> {datosAlumno.boleta}</p>
          </div>
        </div>
      </section>

      <div className="ticks"></div>
      
      {/* Sección de espaciado para mantener el estilo original */}
      <section id="spacer"></section>
    </>
  )
}

export default App