package com.ensam.inventia.unit;
import com.ensam.inventia.entity.Hackathon; import com.ensam.inventia.enums.HackathonStatus; import org.junit.jupiter.api.Test; import java.time.LocalDate; import static org.assertj.core.api.Assertions.assertThat;
class HackathonServiceTest { @Test void computeStatusCorrectly(){ var h=Hackathon.builder().startDate(LocalDate.now().plusDays(1)).endDate(LocalDate.now().plusDays(2)).build(); h.computeStatus(); assertThat(h.getStatus()).isEqualTo(HackathonStatus.UPCOMING); } }
