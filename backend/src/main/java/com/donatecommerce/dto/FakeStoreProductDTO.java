package com.donatecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class FakeStoreProductDTO {
    private Long id;
    private String title;
    private Double price;
    private String description;
    private String category;
    private String image;
    
    @JsonProperty("rating")
    private Rating rating;
    
    @Data
    public static class Rating {
        private Double rate;
        private Integer count;
    }
}