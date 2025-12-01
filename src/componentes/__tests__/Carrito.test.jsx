import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Carrito from '../Carrito';

// Mock del contexto del carrito
const mockContext = {
  carrito: [
    {
      id: 1,
      nombre: 'Laptop Gaming',
      precio: 910990,
      imagen: 'laptop1g.webp',
      categoria: 'tecnologia',
      cantidad: 1
    },
    {
      id: 2,
      nombre: 'Smartphone Pro', 
      precio: 710990,
      imagen: 'smartphone1.webp',
      categoria: 'tecnologia',
      cantidad: 2
    }
  ],
  total: 2332970,
  eliminarDelCarrito: jest.fn(),
  actualizarCantidad: jest.fn(),
  limpiarCarrito: jest.fn()
};

jest.mock('../CarritoContext', () => ({
  useCarrito: () => mockContext
}));

// Mock simple de react-bootstrap
jest.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
  Card: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardBody: ({ children }) => <div>{children}</div>,
  Button: ({ onClick, disabled, children }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Table: ({ children }) => <table>{children}</table>,
  Alert: ({ children }) => <div>{children}</div>,
  Badge: ({ children }) => <span>{children}</span>
}));

// Mock simple de react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));

describe('Componente Carrito', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('debería mostrar productos cuando el carrito tiene items', () => {
    render(<Carrito />);
    
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
    expect(screen.getByText('Smartphone Pro')).toBeInTheDocument();
  });

  test('debería mostrar el total formateado', () => {
    render(<Carrito />);
    expect(screen.getByText('$2.332.970')).toBeInTheDocument();
  });

  test('debería llamar eliminarDelCarrito al hacer clic en eliminar', () => {
    render(<Carrito />);
    
    const botonesEliminar = screen.getAllByText('🗑️');
    fireEvent.click(botonesEliminar[0]);
    
    expect(mockContext.eliminarDelCarrito).toHaveBeenCalledWith(1);
  });

  test('debería llamar actualizarCantidad al aumentar cantidad', () => {
    render(<Carrito />);
    
    const botonesAumentar = screen.getAllByText('+');
    fireEvent.click(botonesAumentar[0]);
    
    expect(mockContext.actualizarCantidad).toHaveBeenCalledWith(1, 2);
  });

  test('debería llamar limpiarCarrito al hacer clic en Vaciar Carrito', () => {
    render(<Carrito />);
    
    const botonVaciar = screen.getByText('Vaciar Carrito');
    fireEvent.click(botonVaciar);
    
    expect(mockContext.limpiarCarrito).toHaveBeenCalled();
  });

  test('debería mostrar mensaje de carrito vacío cuando no hay productos', () => {
    // Mock con carrito vacío
    jest.doMock('../CarritoContext', () => ({
      useCarrito: () => ({
        carrito: [],
        total: 0,
        eliminarDelCarrito: jest.fn(),
        actualizarCantidad: jest.fn(),
        limpiarCarrito: jest.fn()
      })
    }));
    
    const { useCarrito } = require('../CarritoContext');
    const Carrito = require('../Carrito').default;
    
    render(<Carrito />);
    
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });
});