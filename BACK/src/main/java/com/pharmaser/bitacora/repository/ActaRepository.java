package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.Acta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActaRepository extends JpaRepository<Acta, Long> {
}
