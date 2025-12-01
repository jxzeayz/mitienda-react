# MiTienda - Frontend (React)

## Descripción del Proyecto

Frontend de la tienda online MiTienda, desarrollado con React 19. Implementa una interfaz de usuario moderna y responsive que se comunica con el backend Spring Boot mediante API REST.

## Tecnologías Utilizadas

- **React 19.2.0**
- **React Router DOM 7.9.4** - Navegación SPA
- **React Bootstrap 2.10.10** - Componentes UI
- **Bootstrap 5.3.8** - Framework CSS
- **Axios 1.13.2** - Cliente HTTP
- **Context API** - Gestión de estado global

## Estructura del Proyecto

```
src/
├── componentes/
│   ├── AuthContext.jsx        # Contexto de autenticación
│   ├── CarritoContext.jsx     # Contexto del carrito
│   ├── ProtectedRoute.jsx     # Rutas protegidas
│   ├── Header.jsx             # Navegación principal
│   ├── Footer.jsx             # Pie de página
│   ├── Home.jsx               # Página de inicio
│   ├── Productos.jsx          # Catálogo de productos
│   ├── Carrito.jsx            # Carrito de compras
│   ├── Ofertas.jsx            # Ofertas especiales
│   ├── Contacto.jsx           # Formulario de contacto
│   ├── LoginComprador.jsx     # Login para compradores
│   ├── LoginAdmin.jsx         # Login para administradores
│   ├── Registro.jsx           # Registro de usuarios
│   ├── Perfil.jsx             # Perfil del usuario
│   ├── PanelAdmin.jsx         # Panel de administración
│   └── __tests__/             # Tests unitarios
│       ├── Carrito.test.jsx
│       └── Producto.test.jsx
├── services/
│   └── api.js                 # Servicios de comunicación con API
├── App.js                     # Componente principal
├── App.css                    # Estilos globales
└── index.js                   # Punto de entrada
```

## Funcionalidades Implementadas

### Autenticación y Sesiones
- Login para compradores y administradores
- Registro de nuevos usuarios
- Persistencia de sesión con localStorage
- Validación de tokens JWT
- Cierre de sesión seguro
- Decodificación de tokens JWT

### Gestión del Carrito
- Agregar productos al carrito
- Modificar cantidades
- Eliminar productos
- Cálculo automático de totales
- Persistencia en memoria
- Creación de pedidos

### Restricciones de Acceso por Rol

#### Rutas Públicas
- `/` - Inicio
- `/productos` - Catálogo
- `/ofertas` - Ofertas especiales
- `/contacto` - Formulario de contacto
- `/carrito` - Carrito de compras
- `/login` - Login comprador
- `/login-admin` - Login administrador
- `/registro` - Registro

#### Rutas Solo Comprador
- `/perfil` - Perfil del usuario con historial de pedidos

#### Rutas Solo Administrador
- `/admin` - Panel de administración completo

### Panel de Administración
- Dashboard con estadísticas
- Gestión CRUD de productos
- Gestión de pedidos (cambio de estados)
- Gestión de usuarios

## Gestión de Sesiones

### AuthContext
El contexto de autenticación (`AuthContext.jsx`) maneja:

```javascript
// Estados
- user: Información del usuario actual
- token: Token JWT activo
- loading: Estado de carga inicial

// Funciones
- loginComprador(): Login para compradores
- loginAdmin(): Login para administradores
- registro(): Registro de nuevos usuarios
- logout(): Cierre de sesión
- isAuthenticated(): Verifica si está autenticado
- isAdmin(): Verifica rol administrador
- isComprador(): Verifica rol comprador
```

### Persistencia de Sesión
- El token JWT se guarda en `localStorage`
- Al recargar la página, se recupera la sesión
- Se valida la expiración del token automáticamente
- Si el token expira, se limpia la sesión

### Interceptores Axios
```javascript
// Request: Agrega token a todas las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Maneja errores 401 (token expirado)
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return Promise.reject(error);
});
```

## Protección de Rutas

El componente `ProtectedRoute` implementa las restricciones de acceso:

```jsx
// Uso para rutas de comprador
<ProtectedRoute requireAuth={true} requireComprador={true}>
  <Perfil />
</ProtectedRoute>

// Uso para rutas de administrador
<ProtectedRoute requireAuth={true} requireAdmin={true}>
  <PanelAdmin />
</ProtectedRoute>
```

### Comportamiento
1. Si `requireAuth` y no está autenticado → Redirige a `/login`
2. Si `requireAdmin` y no es admin → Redirige a `/`
3. Si `requireComprador` y no es comprador → Redirige a `/`

## Comunicación con el Backend

### Servicios API (`services/api.js`)

```javascript
// AuthService - Autenticación
authService.login(email, password)
authService.loginAdmin(email, password)
authService.registro(nombre, email, password, confirmPassword)

// ProductoService - Productos
productoService.getAll()
productoService.getById(id)
productoService.getByCategoria(categoria)
productoService.create(producto)
productoService.update(id, producto)
productoService.delete(id)

// PedidoService - Pedidos
pedidoService.getAll()           // Mis pedidos
pedidoService.getAllAdmin()      // Todos (admin)
pedidoService.getById(id)
pedidoService.create(items)
pedidoService.updateEstado(id, estado)

// UsuarioService - Usuarios (solo admin)
usuarioService.getAll()
usuarioService.getById(id)
usuarioService.delete(id)
```

## Instalación y Ejecución

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Backend Spring Boot ejecutándose en http://localhost:8080

### Instalación
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

La aplicación estará disponible en: http://localhost:3000

### Scripts Disponibles
```bash
npm start      # Inicia en modo desarrollo
npm test       # Ejecuta tests
npm run build  # Genera build de producción
```

## Ejemplos de Interfaces Restringidas

### Header (Navegación Condicional)
```jsx
// Solo muestra "Panel Admin" si es administrador
{isAdmin() && (
  <Nav.Link as={Link} to="/admin">
    🔐 Panel Admin
  </Nav.Link>
)}

// Solo muestra carrito si es comprador
{isComprador() && (
  <Nav.Link as={Link} to="/carrito">
    🛍️ Carrito
  </Nav.Link>
)}
```

### Panel Admin (CRUD Completo)
- Solo accesible por usuarios con rol ADMINISTRADOR
- Gestión de productos: crear, editar, eliminar
- Gestión de pedidos: cambiar estados
- Gestión de usuarios: ver y eliminar

### Perfil (Historial de Pedidos)
- Solo accesible por usuarios con rol COMPRADOR
- Muestra historial de pedidos reales del backend
- Configuración de cuenta

## Credenciales de Prueba

### Comprador
- Email: `cliente@test.com`
- Contraseña: `123456`

### Administrador
- Email: `admin@test.com`
- Contraseña: `admin123`

## Flujo de Datos

### Login → Navegación
```
1. Usuario ingresa credenciales
2. Frontend envía POST a /api/auth/login
3. Backend valida y retorna token JWT
4. Frontend guarda token en localStorage
5. AuthContext actualiza estado global
6. Header muestra opciones según rol
7. Rutas protegidas permiten/deniegan acceso
```

### Carrito → Pedido
```
1. Usuario agrega productos al carrito
2. CarritoContext actualiza estado
3. Usuario hace clic en "Finalizar Compra"
4. Se verifica autenticación
5. Frontend envía POST a /api/pedidos
6. Backend crea pedido y actualiza stock
7. Frontend limpia carrito y redirige a perfil
```

## Tests

Los tests se encuentran en `src/componentes/__tests__/`:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con cobertura
npm test -- --coverage
```

## Autor

Desarrollado para la evaluación EV3 - Desarrollo de Aplicaciones Full Stack
