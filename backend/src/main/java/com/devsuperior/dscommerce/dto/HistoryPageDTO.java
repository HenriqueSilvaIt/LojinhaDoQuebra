package com.devsuperior.dscommerce.dto;

import org.springframework.data.domain.Page;

public class HistoryPageDTO {

    private Page<HistoryDTO> historyPage;
    private Double totalAmountForPeriod; // O novo campo

    public HistoryPageDTO(Page<HistoryDTO> historyPage, Double totalAmountForPeriod) {
        this.historyPage = historyPage;
        this.totalAmountForPeriod = totalAmountForPeriod;
    }

    // Getters
    public Page<HistoryDTO> getHistoryPage() {
        return historyPage;
    }

    public Double getTotalAmountForPeriod() {
        return totalAmountForPeriod;
    }
}
