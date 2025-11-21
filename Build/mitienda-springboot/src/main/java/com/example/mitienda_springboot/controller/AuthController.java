package com.example.mitienda_springboot.controller;

import com.example.mitienda_springboot.dto.LoginRequest;
import com.example.mitienda_springboot.dto.LoginResponse;
import com.example.mitienda_springboot.dto.RegistroRequest;
import com.example.mitienda_springboot.model.Usuario;
import com.example.mitienda_springboot.service.UsuarioService;
import com.example.mitienda_springboot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Usuario usuario = usuarioService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

            if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
                return ResponseEntity.status(401).body("Credenciales inválidas");
            }

            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getId(), usuario.getRol().name());

            LoginResponse response = new LoginResponse(
                    token,
                    usuario.getId(),
                    usuario.getEmail(),
                    usuario.getNombre(),
                    usuario.getRol().name().toLowerCase()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error en el login: " + e.getMessage());
        }
    }

    @PostMapping("/login-admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest loginRequest) {
        try {
            Usuario usuario = usuarioService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

            if (usuario.getRol() != Usuario.Rol.ADMINISTRADOR) {
                return ResponseEntity.status(403).body("Acceso denegado. Se requiere rol de administrador");
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
                return ResponseEntity.status(401).body("Credenciales inválidas");
            }

            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getId(), usuario.getRol().name());

            LoginResponse response = new LoginResponse(
                    token,
                    usuario.getId(),
                    usuario.getEmail(),
                    usuario.getNombre(),
                    usuario.getRol().name().toLowerCase()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error en el login: " + e.getMessage());
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody RegistroRequest registroRequest) {
        try {
            if (!registroRequest.getPassword().equals(registroRequest.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Las contraseñas no coinciden");
            }

            if (registroRequest.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("La contraseña debe tener al menos 6 caracteres");
            }

            if (usuarioService.existsByEmail(registroRequest.getEmail())) {
                return ResponseEntity.badRequest().body("El email ya está registrado");
            }

            Usuario nuevoUsuario = new Usuario(
                    registroRequest.getEmail(),
                    registroRequest.getPassword(),
                    registroRequest.getNombre(),
                    Usuario.Rol.COMPRADOR
            );

            nuevoUsuario = usuarioService.save(nuevoUsuario);

            String token = jwtUtil.generateToken(nuevoUsuario.getEmail(), nuevoUsuario.getId(), nuevoUsuario.getRol().name());

            LoginResponse response = new LoginResponse(
                    token,
                    nuevoUsuario.getId(),
                    nuevoUsuario.getEmail(),
                    nuevoUsuario.getNombre(),
                    nuevoUsuario.getRol().name().toLowerCase()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en el registro: " + e.getMessage());
        }
    }
}

