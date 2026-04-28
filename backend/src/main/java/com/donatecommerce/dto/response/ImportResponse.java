package com.donatecommerce.dto.response;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResponse {
    private boolean success;
    private String message;
    private int totalFetched;
    private int totalSaved;
    private int totalSkipped;
    private List<String> errors;
    private Map<String, Integer> categoryStats;
}