package com.pharmaser.bitacora.controller;

import com.pharmaser.bitacora.model.dto.ChatRequestDTO;
import com.pharmaser.bitacora.model.dto.ChatResponseDTO;
import com.pharmaser.bitacora.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.util.retry.Retry;
import java.time.Duration;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("")
    public ChatResponseDTO preguntar(@RequestBody ChatRequestDTO request) {
        return chatService.preguntar(request)
                .timeout(Duration.ofMinutes(5))
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(2)))
                .block();
    }
}
