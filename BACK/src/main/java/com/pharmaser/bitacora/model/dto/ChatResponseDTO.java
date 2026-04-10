package com.pharmaser.bitacora.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatResponseDTO {
    private String model;
    private ChatMessageDTO message;
    private boolean done;

    public ChatResponseDTO() {}

    // Getters and Setters
    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public ChatMessageDTO getMessage() {
        return message;
    }

    public void setMessage(ChatMessageDTO message) {
        this.message = message;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }
}
