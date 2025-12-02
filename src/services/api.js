import axios from 'axios';

// =============================================
// CONFIGURACIÓN BASE
// =============================================
const API_BASE_URL = 'http://localhost:8080/api';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// =============================================
// INTERCEPTORES
// =============================================

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// =============================================
// SERVICIO DE AUTENTICACIÓN
// =============================================
class AuthService {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    }

    async loginAdmin(email, password) {
        const response = await api.post('/auth/login-admin', { email, password });
        return response.data;
    }

    async registro(nombre, email, password, confirmPassword) {
        const response = await api.post('/auth/registro', { nombre, email, password, confirmPassword });
        return response.data;
    }
}

// =============================================
// SERVICIO DE PRODUCTOS
// =============================================
class ProductoService {
    async getAll() {
        const response = await api.get('/productos');
        return response.data;
    }

    async getById(id) {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    }

    async getByCategoria(categoria) {
        const response = await api.get(`/productos/categoria/${categoria}`);
        return response.data;
    }

    async create(producto) {
        const response = await api.post('/productos', producto);
        return response.data;
    }

    async update(id, producto) {
        const response = await api.put(`/productos/${id}`, producto);
        return response.data;
    }

    async delete(id) {
        await api.delete(`/productos/${id}`);
    }
}

// =============================================
// SERVICIO DE PEDIDOS
// =============================================
class PedidoService {
    async getAll() {
        const response = await api.get('/pedidos');
        return response.data;
    }

    async getById(id) {
        const response = await api.get(`/pedidos/${id}`);
        return response.data;
    }

    async create(items) {
        const response = await api.post('/pedidos', items);
        return response.data;
    }

    async updateEstado(id, estado) {
        const response = await api.put(`/pedidos/${id}/estado`, { estado });
        return response.data;
    }

    async getAllAdmin() {
        const response = await api.get('/pedidos/todos');
        return response.data;
    }
}

// =============================================
// SERVICIO DE USUARIOS (Solo Admin)
// =============================================
class UsuarioService {
    async getAll() {
        const response = await api.get('/usuarios');
        return response.data;
    }

    async getById(id) {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    }

    async delete(id) {
        await api.delete(`/usuarios/${id}`);
    }
}

// =============================================
// SERVICIO DE CONTACTO
// =============================================
class ContactoService {
    async enviarMensaje(mensaje) {
        const response = await api.post('/contacto', mensaje);
        return response.data;
    }

    async getAll() {
        const response = await api.get('/contacto');
        return response.data;
    }

    async getById(id) {
        const response = await api.get(`/contacto/${id}`);
        return response.data;
    }

    async getNoLeidos() {
        const response = await api.get('/contacto/no-leidos');
        return response.data;
    }

    async countNoLeidos() {
        const response = await api.get('/contacto/count-no-leidos');
        return response.data;
    }

    async marcarComoLeido(id) {
        const response = await api.put(`/contacto/${id}/leido`);
        return response.data;
    }

    async delete(id) {
        await api.delete(`/contacto/${id}`);
    }
}

// =============================================
// EXPORTAR INSTANCIAS DE SERVICIOS
// =============================================
export const authService = new AuthService();
export const productoService = new ProductoService();
export const pedidoService = new PedidoService();
export const usuarioService = new UsuarioService();
export const contactoService = new ContactoService();

// Exportar también para compatibilidad con código existente
export const authAPI = authService;
export const productosAPI = productoService;
export const pedidosAPI = pedidoService;
export const usuariosAPI = usuarioService;
export const contactoAPI = contactoService;

export default api;
