import React, { createContext, useContext, useState, useCallback } from 'react';
import { pedidoService } from '../services/api';

// =============================================
// CONTEXTO DEL CARRITO DE COMPRAS
// =============================================
const CarritoContext = createContext();

// Hook personalizado para usar el contexto
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
};

// Proveedor del carrito
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // Agregar producto al carrito
  const agregarAlCarrito = useCallback((producto) => {
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
    setTotal(prevTotal => prevTotal + Number(producto.precio));
  }, []);

  // Eliminar producto del carrito
  const eliminarDelCarrito = useCallback((id) => {
    setCarrito(prevCarrito => {
      const producto = prevCarrito.find(item => item.id === id);
      if (producto) {
        setTotal(prevTotal => prevTotal - (Number(producto.precio) * producto.cantidad));
      }
      return prevCarrito.filter(item => item.id !== id);
    });
  }, []);

  // Actualizar cantidad de un producto
  const actualizarCantidad = useCallback((id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    setCarrito(prevCarrito => {
      const producto = prevCarrito.find(item => item.id === id);
      if (producto) {
        const diferencia = nuevaCantidad - producto.cantidad;
        setTotal(prevTotal => prevTotal + (Number(producto.precio) * diferencia));
      }
      
      return prevCarrito.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      );
    });
  }, [eliminarDelCarrito]);

  // Limpiar carrito
  const limpiarCarrito = useCallback(() => {
    setCarrito([]);
    setTotal(0);
  }, []);

  // Crear pedido
  const crearPedido = useCallback(async () => {
    try {
      const items = carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad
      }));

      const pedido = await pedidoService.create(items);
      limpiarCarrito();
      return { success: true, pedido };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }, [carrito, limpiarCarrito]);

  // Obtener cantidad total de items
  const getTotalItems = useCallback(() => {
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }, [carrito]);

  const value = {
    carrito,
    total,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
    crearPedido,
    getTotalItems
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

export default CarritoContext;
