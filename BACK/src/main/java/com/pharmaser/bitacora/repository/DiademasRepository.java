package com.pharmaser.bitacora.repository;


import com.pharmaser.bitacora.model.Diademas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiademasRepository extends JpaRepository<Diademas, Long> {
}
