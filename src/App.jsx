import { useEffect, useState } from 'react'
import { Agentation } from 'agentation'
import NetworkDiagram from './NetworkDiagram'
import { measures } from './measures'

const heroSrc = `${import.meta.env.BASE_URL}images/marea-hero.jpg`

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function Measure({ item }) {
  const [technical, setTechnical] = useState(false)

  return (
    <article className="measure" data-reveal>
      <div className="measure-label">{item.label}</div>
      <div className="measure-content">
        <p key={technical ? 'tech' : 'plain'} className={technical ? 'measure-text technical' : 'measure-text'}>
          {technical ? item.technical : item.simple}
        </p>
        <button
          type="button"
          className="mode-toggle"
          aria-pressed={technical}
          onClick={() => setTechnical((value) => !value)}
        >
          <span className="mode-switch" aria-hidden="true">
            <span className="mode-switch-knob" />
          </span>
          {technical ? 'Volver a lo sencillo' : 'Ver cómo se hizo'}
        </button>
      </div>
    </article>
  )
}

export default function App() {
  const [position, setPosition] = useState(52)
  useReveal()

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio">
          Mareas Asesores
        </a>
        <a className="header-link" href="#diapositivas">
          Diapositivas
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <h1>Antes, cualquiera podía llegar a los documentos.</h1>
            <p className="hero-context">
              Diagnóstico, decisiones y medidas de bastionado en una gestoría real de la maqueta.
            </p>
            <a className="hero-action" href="#red">
              Ver la red <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${heroSrc})` }}
            role="img"
            aria-label="Olas rompiendo contra rocas, alusión al nombre Mareas Asesores"
          />
        </section>

        <section className="context section-ink" id="contexto">
          <h2 data-reveal>Lo que encontramos</h2>
          <div className="context-lines">
            <p data-reveal>Todo estaba en la misma red: servidor, puestos, impresoras y el móvil de un cliente.</p>
            <p data-reveal>La carpeta de clientes se abría sin contraseña.</p>
            <p data-reveal>En septiembre robaron un portátil y no sabemos si pudieron leer sus datos.</p>
          </div>
        </section>

        <section className="network section-paper" id="red">
          <div className="section-head">
            <h2 data-reveal>La red, antes y después</h2>
            <p data-reveal>Ahora hay tres zonas. Arranca con el deslizador.</p>
          </div>

          <div className="slider-wrap" data-reveal>
            <NetworkDiagram position={position} />
            <input
              className="slider-input"
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label="Comparar la red antes y después"
              aria-valuetext={`Vista: ${position}% antes, ${100 - position}% después`}
            />
          </div>

          <div className="why">
            <h3 data-reveal>Por qué la cambiamos</h3>
            <div className="why-rows">
              <p data-reveal><span>Separamos</span> a clientes, empleados y servidor para que no se vean entre sí.</p>
              <p data-reveal><span>Dejamos entrar</span> a la asesoría solo desde su dirección conocida.</p>
              <p data-reveal><span>Cerramos</span> el wifi de la sala de espera a la oficina.</p>
            </div>
          </div>
        </section>

        <section className="measures section-paper" id="medidas">
          <div className="section-head">
            <h2 data-reveal>Lo que hemos hecho</h2>
            <p data-reveal>Cambia cada medida a modo técnico si quieres ver cómo se implantó.</p>
          </div>
          <div className="measure-list">
            {measures.map((item) => (
              <Measure key={item.id} item={item} />
            ))}
          </div>
          <p className="pending-note" data-reveal>
            Queda pendiente reducir los servicios del servidor. No lo damos por hecho.
          </p>
        </section>

        <section className="closing section-ink" id="diapositivas">
          <h2 data-reveal>Cuéntame qué te parece.</h2>
          <p data-reveal>
            La presentación reúne lo hecho, lo que sigue y las restricciones que hemos respetado.
          </p>
          <a className="closing-action" href="./slides/dist/index.html" data-reveal>
            Abrir la presentación <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <span>Grupo 1 · Bastionado de Redes y Sistemas (UD1)</span>
        <span>Foto: Pexels / Rachel Claire</span>
      </footer>

      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  )
}
