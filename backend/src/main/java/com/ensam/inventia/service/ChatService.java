package com.ensam.inventia.service;
import com.ensam.inventia.dto.request.ChatMessageRequest;
import com.ensam.inventia.dto.response.ChatMessageResponse;
import java.util.List;
public interface ChatService {
    List<ChatMessageResponse> list(Long teamId);
    ChatMessageResponse send(Long teamId, ChatMessageRequest r);
}
