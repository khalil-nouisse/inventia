import { Button, Form, Input, DatePicker, InputNumber, message } from 'antd'; import { useEffect, useState } from 'react'; import { Link, useNavigate } from 'react-router-dom'; import { BarChart3, Download, Plus } from 'lucide-react'; import HackathonCard from '../components/HackathonCard'; import KpiCard from '../components/KpiCard'; import LeaderboardTable from '../components/LeaderboardTable'; import SubmissionRateChart from '../components/SubmissionRateChart'; import ScoreDistributionChart from '../components/ScoreDistributionChart'; import { useAuth } from '../context/AuthContext'; import { hackathonService } from '../services/hackathonService'; import { dashboardService } from '../services/dashboardService';
export function LandingPage(){return <main className="hero"><section><img src="/assets/logo-dark.png" alt="InventIA" /><h1>Hackathon operations for ENSAM teams</h1><p>Manage registrations, teams, submissions, scores, leaderboards, and exports from one role-protected workspace.</p><Link className="primary" to="/hackathons">View hackathons</Link></section></main>}
export function LoginPage(){const {login}=useAuth(); return <main className="panel"><h1>Login</h1><Form layout="vertical" onFinish={login}><Form.Item name="email" label="Email" rules={[{required:true}]}><Input /></Form.Item><Form.Item name="password" label="Password" rules={[{required:true}]}><Input.Password /></Form.Item><Button type="primary" htmlType="submit">Login</Button></Form></main>}
export function RegisterPage(){return <main className="panel"><h1>Register</h1><Form layout="vertical"><Form.Item label="Email"><Input /></Form.Item><Button type="primary">Create account</Button></Form></main>}
export function HackathonListPage(){const [items,setItems]=useState([]); useEffect(()=>{hackathonService.list().then(r=>setItems(r.data.data.content)).catch(()=>setItems([]));},[]); return <main><div className="pagehead"><h1>Hackathons</h1><Link className="primary" to="/hackathons/new"><Plus size={16}/>Create</Link></div><div className="grid">{items.map(h=><HackathonCard key={h.id} hackathon={h}/>)}</div></main>}
export function HackathonDetailPage(){return <main className="panel"><h1>Hackathon details</h1><p>Teams, submissions, leaderboard, PDF and Excel exports.</p><Button icon={<Download size={16}/>}>Export</Button></main>}
export function HackathonFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        registrationDeadline: values.registrationDeadline.format('YYYY-MM-DD'),
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };
      await hackathonService.create(payload);
      message.success('Hackathon created successfully');
      navigate('/hackathons');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create hackathon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="panel">
      <h1>Create hackathon</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="theme" label="Theme">
          <Input />
        </Form.Item>
        <Form.Item name="prize" label="Prize">
          <Input />
        </Form.Item>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Form.Item name="registrationDeadline" label="Registration Deadline" rules={[{ required: true }]} style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]} style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Form.Item name="endDate" label="End Date" rules={[{ required: true }]} style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maxTeamSize" label="Max Team Size" rules={[{ required: true }]} style={{ flex: 1 }}>
            <InputNumber min={2} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create
        </Button>
      </Form>
    </main>
  );
}
export function TeamListPage(){return <main className="panel"><h1>Teams</h1></main>}
export function TeamDetailPage(){return <main className="panel"><h1>Team details</h1></main>}
export function SubmissionFormPage(){return <main className="panel"><h1>Submission</h1></main>}
export function LeaderboardPage(){return <main className="panel"><h1>Leaderboard</h1><LeaderboardTable rows={[]} /></main>}
export function ScoringPage(){return <main className="panel"><h1>Scoring</h1></main>}
export function DashboardPage(){const [s,setS]=useState(null); useEffect(()=>{dashboardService.manager().then(r=>setS(r.data.data)).catch(()=>{});},[]); const data=[{name:'Users',value:s?.totalUsers||0},{name:'Hackathons',value:s?.totalHackathons||0},{name:'Teams',value:s?.totalTeams||0}]; return <main><div className="pagehead"><h1><BarChart3/>Dashboard</h1></div><div className="kpis"><KpiCard label="Users" value={s?.totalUsers||0}/><KpiCard label="Hackathons" value={s?.totalHackathons||0}/><KpiCard label="Teams" value={s?.totalTeams||0}/><KpiCard label="Submissions" value={s?.totalSubmissions||0}/></div><div className="charts"><SubmissionRateChart data={data}/><ScoreDistributionChart data={data}/></div></main>}
export function UserDashboardPage(){return <main className="panel"><h1>My work</h1></main>}
export function AdminUserManagementPage(){return <main className="panel"><h1>User management</h1></main>}
export function ProfilePage(){const {user}=useAuth(); return <main className="panel"><h1>Profile</h1><p>{user?.email}</p></main>}
export function NotFoundPage(){return <main className="panel"><h1>Not found</h1></main>}
export function UnauthorizedPage(){return <main className="panel"><h1>Unauthorized</h1></main>}
