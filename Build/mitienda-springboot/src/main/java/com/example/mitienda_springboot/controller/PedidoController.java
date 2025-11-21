package com.example.mitienda_springboot.controller;

import com.example.mitienda_springboot.model.Pedido;
import com.example.mitienda_springboot.model.Usuario;
import com.example.mitienda_springboot.service.PedidoService;
import com.example.mitienda_springboot.service.UsuarioService;
import com.example.mitienda_springboot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:3000")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    private Usuario getUsuarioFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Long userId = jwtUtil.extractUserId(token);
        return usuarioService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> getPedidos(HttpServletRequest request) {
        Usuario usuario = getUsuarioFromToken(request);
        List<Pedido> pedidos = pedidoService.findByUsuario(usuario);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long id, HttpServletRequest request) {
        Usuario usuario = getUsuarioFromToken(request);
        Pedido pedido = pedidoService.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Solo el dueño del pedido o un admin puede verlo
        if (!pedido.getUsuario().getId().equals(usuario.getId()) && 
            usuario.getRol() != Usuario.Rol.ADMINISTRADOR) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(pedido);
    }

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(
            @RequestBody List<PedidoService.ItemPedidoRequest> items,
            HttpServletRequest request) {
        try {
            Usuario usuario = getUsuarioFromToken(request);
            Pedido pedido = pedidoService.crearPedido(usuario, items);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Pedido> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> estadoMap) {
        try {
            Pedido.Estado nuevoEstado = Pedido.Estado.valueOf(estadoMap.get("estado").toUpperCase());
            Pedido pedido = pedidoService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/todos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        return ResponseEntity.ok(pedidoService.findAll());
    }
}

