package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.Impresora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImpresoraRepository extends JpaRepository<Impresora, Long> {
}
