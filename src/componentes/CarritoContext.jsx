import React, { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const existe = prevCarrito.find(item => item.id === producto.id);
      if (existe) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
    setTotal(prevTotal => prevTotal + producto.precio);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prevCarrito => {
      const producto = prevCarrito.find(item => item.id === id);
      setTotal(prevTotal => prevTotal - (producto.precio * producto.cantidad));
      return prevCarrito.filter(item => item.id !== id);
    });
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    setCarrito(prevCarrito => {
      const producto = prevCarrito.find(item => item.id === id);
      const diferencia = nuevaCantidad - producto.cantidad;
      
      setTotal(prevTotal => prevTotal + (producto.precio * diferencia));
      
      return prevCarrito.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      );
    });
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    setTotal(0);
  };

  const value = {
    carrito,
    total,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    limpiarCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};