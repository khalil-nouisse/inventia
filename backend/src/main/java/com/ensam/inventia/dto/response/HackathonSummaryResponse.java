package com.ensam.inventia.dto.response;

import java.time.LocalDate;

public record HackathonSummaryResponse(
    Long id,
    String title,
    String theme,
    LocalDate startDate,
    LocalDate endDate,
    String status
) {}
