package com.example.mitienda_springboot.service;

import com.example.mitienda_springboot.model.*;
import com.example.mitienda_springboot.repository.PedidoRepository;
import com.example.mitienda_springboot.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }

    public List<Pedido> findByUsuario(Usuario usuario) {
        return pedidoRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
    }

    @Transactional
    public Pedido crearPedido(Usuario usuario, List<ItemPedidoRequest> items) {
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setEstado(Pedido.Estado.PENDIENTE);

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoRequest itemReq : items) {
            Producto producto = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + itemReq.getProductoId()));

            if (producto.getStock() < itemReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            ItemPedido item = new ItemPedido(pedido, producto, itemReq.getCantidad());
            pedido.getItems().add(item);
            total = total.add(item.getSubtotal());

            // Actualizar stock
            producto.setStock(producto.getStock() - itemReq.getCantidad());
            productoRepository.save(producto);
        }

        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }

    public Pedido actualizarEstado(Long id, Pedido.Estado nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    public static class ItemPedidoRequest {
        private Long productoId;
        private Integer cantidad;

        public Long getProductoId() {
            return productoId;
        }

        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}

