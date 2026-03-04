package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.PcEscritorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PcEscritorioRepository extends JpaRepository<PcEscritorio, Long> {
}
