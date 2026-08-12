package com.Hoctructuyenchieu.Ecommerce.web.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health Check", description = "Endpoints for checking backend system health")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check backend health status", description = "Returns a simple string if backend service is running")
    public String checkHealth() {
        return "Backend is running smoothly!";
    }
}

