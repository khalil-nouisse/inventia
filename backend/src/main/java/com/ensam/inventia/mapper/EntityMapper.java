package com.ensam.inventia.mapper;
import com.ensam.inventia.dto.response.*; import com.ensam.inventia.entity.*; import java.util.*; import java.util.stream.*;
import org.springframework.stereotype.Component;
@Component
public class EntityMapper {
 public UserResponse user(User u){ return new UserResponse(u.getId(),u.getUsername(),u.getEmail(),u.getFirstName(),u.getLastName(),u.getBio(),u.getEnabled(),u.getRole() != null ? u.getRole().getName().name() : null); }
 public HackathonResponse hackathon(Hackathon h){ return new HackathonResponse(h.getId(),h.getTitle(),h.getDescription(),h.getTheme(),h.getPrize(),h.getRegistrationDeadline(),h.getStartDate(),h.getEndDate(),h.getMaxTeamSize(),h.getStatus().name(),user(h.getCreatedBy())); }
 public HackathonSummaryResponse hackathonSummary(Hackathon h){ return new HackathonSummaryResponse(h.getId(),h.getTitle(),h.getTheme(),h.getStartDate(),h.getEndDate(),h.getStatus().name()); }
 public TeamMemberResponse member(TeamMember m){ return new TeamMemberResponse(m.getId(), user(m.getUser()), m.getMemberRole().name()); }
 public TeamResponse team(Team t){ return new TeamResponse(t.getId(),t.getName(),t.getDescription(),t.getTechStack(),t.getHackathon().getId(),t.getMembers().stream().map(this::member).toList()); }
 public SubmissionResponse submission(Submission s){ return new SubmissionResponse(s.getId(),s.getTitle(),s.getDescription(),s.getRepositoryUrl(),s.getDemoUrl(),s.getTechStack(),s.getSubmittedAt(),s.getTeam().getId()); }
 public ScoreResponse score(Score s){ return new ScoreResponse(s.getId(),s.getTechnicalScore(),s.getCreativityScore(),s.getPresentationScore(),s.getComment(),s.getFinalScore(),user(s.getJudge())); }
}
