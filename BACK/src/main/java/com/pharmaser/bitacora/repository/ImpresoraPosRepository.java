package com.pharmaser.bitacora.repository;

import com.pharmaser.bitacora.model.ImpresoraPos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImpresoraPosRepository extends JpaRepository<ImpresoraPos, Long> {
}
