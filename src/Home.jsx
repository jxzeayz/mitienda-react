import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const handleComprar = (producto, precio) => {
    alert(`Has añadido "${producto}" al carrito por ${precio}`);
  };

  return (
    <>
      <section className="bienvenida">
        <h2>Bienvenido a MiTienda</h2>
        <p>Encuentra los mejores productos al mejor precio</p>
        <Link to="/productos" className="btn-principal">
          Ver productos
        </Link>
      </section>

      <section className="productos-destacados">
        <h2>Productos Destacados</h2>
        <div className="productos-grid">
          <article className="producto">
            <img src="laptop1g.webp" alt="Laptop Gaming" />
            <h3>Laptop Gaming</h3>
            <p>Potente laptop para gamers</p>
            <p className="precio">$910.990</p>
            <button 
              className="btn-comprar" 
              onClick={() => handleComprar('Laptop Gaming', '$910.990')}
            >
              Comprar
            </button>
          </article>
          <article className="producto">
            <img src="smartphone1.webp" alt="Smartphone" />
            <h3>Smartphone Pro</h3>
            <p>Teléfono de última generación</p>
            <p className="precio">$710.990</p>
            <button 
              className="btn-comprar" 
              onClick={() => handleComprar('Smartphone Pro', '$710.990')}
            >
              Comprar
            </button>
          </article>
          <article className="producto">
            <img src="auriculares1.webp" alt="Auriculares" />
            <h3>Auriculares Bluetooth</h3>
            <p>Sonido de alta calidad</p>
            <p className="precio">$510.990</p>
            <button 
              className="btn-comprar" 
              onClick={() => handleComprar('Auriculares Bluetooth', '$510.990')}
            >
              Comprar
            </button>
          </article>
        </div>
      </section>

      <section className="video-presentacion">
        <h2>Conoce nuestra tienda</h2>
        <div className="video-container">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Video de presentación" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          >
          </iframe>
        </div>
      </section>
    </>
  );
};

export default Home;