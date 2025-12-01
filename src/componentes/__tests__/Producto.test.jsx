import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Productos from '../Productos';

// Mock simple del contexto
jest.mock('../CarritoContext', () => ({
  useCarrito: () => ({
    agregarAlCarrito: jest.fn()
  })
}));

// Mock simple de react-bootstrap
jest.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div>{children}</div>,
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
  Card: ({ children }) => <div>{children}</div>,
  CardImg: ({ src, alt }) => <img src={src} alt={alt} />,
  CardBody: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <h3>{children}</h3>,
  CardText: ({ children }) => <p>{children}</p>,
  Button: ({ onClick, disabled, children }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Badge: ({ children }) => <span>{children}</span>,
  Form: {
    Group: ({ children }) => <div>{children}</div>,
    Label: ({ children }) => <label>{children}</label>,
    Select: ({ value, onChange, children }) => (
      <select value={value} onChange={onChange}>
        {children}
      </select>
    )
  }
}));

describe('Componente Productos', () => {
  test('debería renderizar el título principal', () => {
    render(<Productos />);
    expect(screen.getByText('Nuestros Productos')).toBeInTheDocument();
  });

  test('debería mostrar todos los productos', () => {
    render(<Productos />);
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
    expect(screen.getByText('Smartphone Pro')).toBeInTheDocument();
    expect(screen.getByText('Auriculares Bluetooth')).toBeInTheDocument();
  });

  test('debería mostrar los precios formateados', () => {
    render(<Productos />);
    expect(screen.getByText('$910.990')).toBeInTheDocument();
    expect(screen.getByText('$710.990')).toBeInTheDocument();
  });

  test('debería filtrar productos por categoría', () => {
    render(<Productos />);
    
    // Encontrar el select de categoría por su label
    const categoriaLabel = screen.getByText('Filtrar por categoría:');
    const select = categoriaLabel.parentElement.querySelector('select');
    
    fireEvent.change(select, { target: { value: 'tecnologia' } });
    
    expect(screen.getByText('Laptop Gaming')).toBeInTheDocument();
    expect(screen.getByText('Smartphone Pro')).toBeInTheDocument();
    expect(screen.queryByText('Auriculares Bluetooth')).not.toBeInTheDocument();
  });

  test('debería tener botones de agregar al carrito', () => {
    render(<Productos />);
    const botones = screen.getAllByText('Agregar al Carrito');
    expect(botones.length).toBeGreaterThan(0);
  });

  test('debería mostrar producto sin stock como deshabilitado', () => {
    render(<Productos />);
    const botonSinStock = screen.getByText('Sin Stock');
    expect(botonSinStock).toBeDisabled();
  });
});