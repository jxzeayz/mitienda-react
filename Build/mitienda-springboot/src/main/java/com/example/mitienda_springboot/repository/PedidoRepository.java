package com.example.mitienda_springboot.repository;

import com.example.mitienda_springboot.model.Pedido;
import com.example.mitienda_springboot.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(Usuario usuario);
    List<Pedido> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
}

