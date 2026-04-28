package com.donatecommerce.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class ImportRequest {
    private String source; // "fakestore", "storepi", "dummyjson"
    private List<String> categories; // Boşsa tüm kategoriler
}