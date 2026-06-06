package com.ensam.inventia.unit;
import com.ensam.inventia.entity.Score; import org.junit.jupiter.api.Test; import static org.assertj.core.api.Assertions.assertThat;
class ScoreServiceTest { @Test void computeFinalScore(){ var s=Score.builder().technicalScore(9).creativityScore(8).presentationScore(7).build(); s.calculate(); assertThat(s.getFinalScore()).isEqualTo(8.0); } }
