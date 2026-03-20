package com.pharmaser.bitacora.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pharmaser.bitacora.model.TiposPerifericos;
import org.springframework.stereotype.Repository;

@Repository
public interface TiposPerifericosRepository extends JpaRepository<TiposPerifericos, Long> {
}
