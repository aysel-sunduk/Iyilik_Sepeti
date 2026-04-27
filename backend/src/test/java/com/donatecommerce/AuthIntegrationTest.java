package com.donatecommerce;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerLoginRefreshLogoutFlowShouldWork() throws Exception {
        String email = "test_" + UUID.randomUUID() + "@mail.com";

        String registerRequest = """
                {
                  "email": "%s",
                  "password": "pass1234",
                  "firstName": "Test",
                  "lastName": "User",
                  "phone": "05551112233"
                }
                """.formatted(email);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerRequest))
                .andExpect(status().isOk());

        String loginRequest = """
                {
                  "email": "%s",
                  "password": "pass1234"
                }
                """.formatted(email);

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode loginJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String refreshToken = loginJson.get("refreshToken").asText();
        assertThat(refreshToken).isNotBlank();
        assertThat(loginJson.get("accessToken").asText()).isNotBlank();

        String refreshRequest = """
                {
                  "refreshToken": "%s"
                }
                """.formatted(refreshToken);

        MvcResult refreshResult = mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshRequest))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode refreshJson = objectMapper.readTree(refreshResult.getResponse().getContentAsString());
        String rotatedRefreshToken = refreshJson.get("refreshToken").asText();
        assertThat(rotatedRefreshToken).isNotBlank();
        assertThat(refreshJson.get("accessToken").asText()).isNotBlank();

        String logoutRequest = """
                {
                  "refreshToken": "%s"
                }
                """.formatted(rotatedRefreshToken);

        mockMvc.perform(post("/auth/logout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(logoutRequest))
                .andExpect(status().isOk());
    }

    @Test
    void registerShouldRejectDuplicateEmail() throws Exception {
        String email = "duplicate_" + UUID.randomUUID() + "@mail.com";

        String firstRegisterRequest = """
                {
                  "email": "%s",
                  "password": "pass1234",
                  "firstName": "Asel",
                  "lastName": "Test",
                  "phone": "05553334455"
                }
                """.formatted(email);

        String duplicateRegisterRequest = """
                {
                  "email": "%s",
                  "password": "pass1234",
                  "firstName": "Asel2",
                  "lastName": "Test2",
                  "phone": "05556667788"
                }
                """.formatted(email.toUpperCase());

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(firstRegisterRequest))
                .andExpect(status().isOk());

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(duplicateRegisterRequest))
                .andExpect(status().isBadRequest());
    }
}
