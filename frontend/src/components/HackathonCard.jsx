import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Gift, Users } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });

function parseDate(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return 'Dates TBA';
  if (!endDate || startDate === endDate) return dateFormatter.format(parseDate(startDate || endDate));
  return `${dateFormatter.format(parseDate(startDate))} - ${dateFormatter.format(parseDate(endDate))}`;
}

function normalizeStatus(status) {
  return String(status || 'Open').toLowerCase().replace(/^\w/, char => char.toUpperCase());
}

export default function HackathonCard({ hackathon }) {
  const status = normalizeStatus(hackathon.status);
  const dateRange = formatDateRange(hackathon.startDate, hackathon.endDate);
  const prize = hackathon.prize || 'Prize TBA';
  const teamSize = hackathon.maxTeamSize ? `Max ${hackathon.maxTeamSize}/team` : 'Team size TBA';

  return (
    <article className="hackathon-card">
      <Link className="hackathon-card__link" to={`/hackathons/${hackathon.id}`} aria-label={`Open ${hackathon.title}`}>
        <div className="hackathon-card__media">
          <span className="hackathon-card__status">{status}</span>
          <span className="hackathon-card__mode">Register</span>
          <img src="/assets/logo-light.png" alt="" className="hackathon-card__logo" aria-hidden="true" />
          <div className="hackathon-card__poster">
            <span>{hackathon.theme || 'AI Challenge'}</span>
            <strong>{hackathon.title}</strong>
          </div>
        </div>

        <div className="hackathon-card__body">
          <div className="hackathon-card__date">
            <CalendarDays size={15} />
            <span>{dateRange}</span>
          </div>
          <h3>{hackathon.title}</h3>
          <p>{hackathon.description || hackathon.theme}</p>

          <div className="hackathon-card__meta" aria-label="Hackathon details">
            <span><Gift size={14} />{prize}</span>
            <span><Users size={14} />{teamSize}</span>
          </div>
        </div>

        <span className="hackathon-card__cta">
          Open <ArrowUpRight size={16} />
        </span>
      </Link>
    </article>
  );
}
