package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.Usuarios;
import com.pharmaser.bitacora.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Usuarios> usuarioOpt = usuariosRepository.findByUsername(username);

        if (usuarioOpt.isEmpty() || usuarioOpt.get().getStatus() != null && !usuarioOpt.get().getStatus()) {
            throw new UsernameNotFoundException("Usuario no encontrado o inactivo: " + username);
        }

        Usuarios usuario = usuarioOpt.get();
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (usuario.getRoles() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRoles().getName().toUpperCase()));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new User(usuario.getUsername(), usuario.getPassword(), authorities);
    }
}
