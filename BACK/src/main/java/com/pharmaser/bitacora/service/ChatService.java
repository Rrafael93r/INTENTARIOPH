package com.pharmaser.bitacora.service;

import com.pharmaser.bitacora.model.dto.ChatMessageDTO;
import com.pharmaser.bitacora.model.dto.ChatRequestDTO;
import com.pharmaser.bitacora.model.dto.ChatResponseDTO;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    private final WebClient webClient;
    private static final String OLLAMA_URL = "http://localhost:11434/api/chat";
    private static final int MAX_HISTORY = 10;

    public ChatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl(OLLAMA_URL)
                .build();
    }

    public Mono<ChatResponseDTO> preguntar(ChatRequestDTO request) {
        List<ChatMessageDTO> originalMessages = request.getMessages();
        List<ChatMessageDTO> messages = new ArrayList<>(originalMessages);
        if (messages.size() > MAX_HISTORY) {
            messages = new ArrayList<>(messages.subList(messages.size() - MAX_HISTORY, messages.size()));
        }

        messages.removeIf(m -> "system".equals(m.getRole()));

        List<ChatMessageDTO> contextMessages = new ArrayList<>();
        ChatMessageDTO systemMessage = new ChatMessageDTO("system",
                "Eres el asistente inteligente de la plataforma Bitácora de Pharmaser. " +
                        "La plataforma cuenta con los siguientes módulos de gestión: " +
                        "1. Hardware: Computadores, portátiles, monitores, impresoras (incluyendo POS), periféricos, diademas y módems. "
                        +
                        "2. Operativa: Farmacias, departamentos, ciudades, áreas y funcionarios. " +
                        "3. Control: Actas de entrega, traslados de equipos y reporte de incidencias/estados. " +
                        "4. Administración: Usuarios, roles, permisos y regentes. " +
                        "Ayuda a los usuarios a resolver dudas sobre cómo navegar o registrar información en la Bitácora de Pharmaser. "
                        +
                        "Mantén tus respuestas breves, amigables, útiles y siempre en español.");
        contextMessages.add(systemMessage);
        contextMessages.addAll(messages);

        request.setMessages(contextMessages);

        // Asegurar que el modelo esté configurado si viene vacío
        if (request.getModel() == null || request.getModel().isEmpty()) {
            request.setModel("gemma");
        }

        return this.webClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.isError(),
                        response -> Mono.error(
                                new RuntimeException("Error al comunicarse con Ollama: " + response.statusCode())))
                .bodyToMono(ChatResponseDTO.class)
                .timeout(Duration.ofSeconds(180))
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(2))) // Reintentar un par de veces si falla
                .onErrorResume(e -> {
                    // Respuesta controlada ante fallos
                    ChatResponseDTO errorResponse = new ChatResponseDTO();
                    errorResponse.setModel(request.getModel());
                    errorResponse.setDone(true);
                    ChatMessageDTO errorMessage = new ChatMessageDTO("assistant",
                            "Lo siento, la IA local no se encuentra disponible en este momento. Por favor, verifica que el servicio esté activo.");
                    errorResponse.setMessage(errorMessage);
                    return Mono.just(errorResponse);
                });
    }
}
