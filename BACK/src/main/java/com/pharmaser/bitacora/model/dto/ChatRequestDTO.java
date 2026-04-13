package com.pharmaser.bitacora.model.dto;

import java.util.List;

public class ChatRequestDTO {
    private String model;
    private List<ChatMessageDTO> messages;
    private boolean stream;

    public ChatRequestDTO() {
        this.stream = false;
    }

    public ChatRequestDTO(String model, List<ChatMessageDTO> messages) {
        this.model = model;
        this.messages = messages;
        this.stream = false;
    }

    // Getters and Setters
    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<ChatMessageDTO> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageDTO> messages) {
        this.messages = messages;
    }

    public boolean isStream() {
        return stream;
    }

    public void setStream(boolean stream) {
        this.stream = stream;
    }
}
