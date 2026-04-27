package com.donatecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LegacySwaggerRedirectController {

    @GetMapping("/api/swagger-ui.html")
    public String redirectSwaggerUiHtml() {
        return "redirect:/swagger-ui/index.html";
    }

    @GetMapping("/api/swagger-ui/index.html")
    public String redirectSwaggerUiIndex() {
        return "redirect:/swagger-ui/index.html";
    }

    @GetMapping("/api/v3/api-docs")
    public String redirectApiDocs() {
        return "redirect:/v3/api-docs";
    }

    @GetMapping("/api/v3/api-docs/swagger-config")
    public String redirectApiDocsSwaggerConfig() {
        return "redirect:/v3/api-docs/swagger-config";
    }
}
