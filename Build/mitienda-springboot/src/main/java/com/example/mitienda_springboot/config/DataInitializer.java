package com.example.mitienda_springboot.config;

import com.example.mitienda_springboot.model.Producto;
import com.example.mitienda_springboot.model.Usuario;
import com.example.mitienda_springboot.repository.ProductoRepository;
import com.example.mitienda_springboot.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Inicializar usuarios si no existen
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario(
                    "admin@test.com",
                    passwordEncoder.encode("admin123"),
                    "Admin Principal",
                    Usuario.Rol.ADMINISTRADOR
            );
            usuarioRepository.save(admin);

            Usuario comprador = new Usuario(
                    "cliente@test.com",
                    passwordEncoder.encode("123456"),
                    "Juan Pérez",
                    Usuario.Rol.COMPRADOR
            );
            usuarioRepository.save(comprador);

            Usuario comprador2 = new Usuario(
                    "maria@test.com",
                    passwordEncoder.encode("123456"),
                    "María García",
                    Usuario.Rol.COMPRADOR
            );
            usuarioRepository.save(comprador2);
        }

        // Inicializar productos si no existen
        if (productoRepository.count() == 0) {
            productoRepository.save(new Producto(
                    "Laptop Gaming",
                    "Potente laptop para gamers",
                    new BigDecimal("910990"),
                    "tecnologia",
                    10,
                    "laptop1g.webp"
            ));

            productoRepository.save(new Producto(
                    "Smartphone Pro",
                    "Teléfono última generación",
                    new BigDecimal("710990"),
                    "tecnologia",
                    15,
                    "smartphone1.webp"
            ));

            productoRepository.save(new Producto(
                    "Auriculares Bluetooth",
                    "Sonido de alta calidad",
                    new BigDecimal("510990"),
                    "accesorios",
                    20,
                    "auriculares1.webp"
            ));

            productoRepository.save(new Producto(
                    "Tablet Pro",
                    "Tablet para trabajo y estudio",
                    new BigDecimal("609990"),
                    "tecnologia",
                    8,
                    "https://via.placeholder.com/300"
            ));

            productoRepository.save(new Producto(
                    "Smartwatch",
                    "Reloj inteligente multifunción",
                    new BigDecimal("299990"),
                    "wearables",
                    12,
                    "https://via.placeholder.com/300"
            ));

            productoRepository.save(new Producto(
                    "Cámara Digital",
                    "Captura momentos especiales",
                    new BigDecimal("799990"),
                    "tecnologia",
                    5,
                    "https://via.placeholder.com/300"
            ));
        }
    }
}

