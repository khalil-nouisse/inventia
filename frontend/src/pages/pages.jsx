import { Button, Form, Input, DatePicker, InputNumber, message, Table, Select, Popconfirm, Modal, Dropdown } from 'antd'; import { useCallback, useEffect, useState } from 'react'; import { Link, useNavigate, useParams } from 'react-router-dom'; import { BarChart3, CalendarDays, Download, Plus, Rocket, ShieldCheck, Trophy, UserPlus, Users } from 'lucide-react'; import HackathonCard from '../components/HackathonCard'; import KpiCard from '../components/KpiCard'; import LeaderboardTable from '../components/LeaderboardTable'; import SubmissionRateChart from '../components/SubmissionRateChart'; import ScoreDistributionChart from '../components/ScoreDistributionChart'; import { useAuth } from '../context/AuthContext'; import { hackathonService } from '../services/hackathonService'; import { dashboardService } from '../services/dashboardService'; import { userService } from '../services/userService'; import { exportService, saveBlob } from '../services/exportService';
import { MyTeamDashboard } from '../components/MyTeamDashboard';
import { teamService } from '../services/teamService';
const pageDateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' });
function formatPageDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('-').map(Number);
  return pageDateFormatter.format(new Date(year, month - 1, day));
}
function formatPageDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '';
  if (!endDate || startDate === endDate) return formatPageDate(startDate || endDate);
  return `${formatPageDate(startDate)} - ${formatPageDate(endDate)}`;
}
export function LandingPage(){return <main className="landing"><section className="landing__content"><div className="landing__copy"><span className="eyebrow">ENSAM competition platform</span><h1>InventIA Hackathon Workspace</h1><p>Run AI hackathons from registration to final ranking with team formation, project submissions, jury scoring, analytics, and exports in one modern workspace.</p><div className="landing__actions"><Link className="primary" to="/hackathons"><Rocket size={18}/>View hackathons</Link><Link className="secondary-link" to="/register">Create account</Link></div><div className="landing__workflow" aria-label="InventIA workflow"><span><Users size={16}/>Team registration</span><span><Trophy size={16}/>Leaderboard</span><span><ShieldCheck size={16}/>Role-protected operations</span></div></div><div className="landing__stage" aria-label="InventIA hackathon workspace preview"><div className="landing__stage-top"><img src="/assets/logo-light.png" alt="InventIA" /><span>Live competition board</span></div><div className="landing__stage-title"><span>ENSAM InventIA Challenge</span><strong>Inventory intelligence</strong></div><div className="landing__stage-grid"><article><span>Teams</span><strong>Registration</strong></article><article><span>Projects</span><strong>Submission</strong></article><article><span>Jury</span><strong>Scoring</strong></article><article><span>Finals</span><strong>Ranking</strong></article></div></div></section><section className="landing__band" aria-label="Platform capabilities"><span>Hackathons</span><span>Teams</span><span>Submissions</span><span>Scores</span><span>Exports</span></section></main>}
export function LoginPage(){const {login}=useAuth(); const navigate=useNavigate(); const onFinish=async(v)=>{try{const u=await login(v); if(u?.role==='ROLE_ADMIN') navigate('/dashboard'); else navigate('/hackathons');}catch{message.error('Login failed');}}; return <main className="auth-page"><section className="auth-card"><div className="auth-card__intro"><span className="eyebrow">Welcome back</span><h1>Login</h1><p>Return to your team workspace, submissions, and competition dashboard.</p></div><Form layout="vertical" onFinish={onFinish}><Form.Item name="email" label="Email" rules={[{required:true}]}><Input size="large" /></Form.Item><Form.Item name="password" label="Password" rules={[{required:true}]}><Input.Password size="large" /></Form.Item><Button type="primary" htmlType="submit" size="large" block>Login</Button></Form></section></main>}
export function RegisterPage(){const {register}=useAuth(); const navigate=useNavigate(); const onFinish=async(v)=>{try{await register(v); navigate('/hackathons');}catch{message.error('Registration failed');}}; return <main className="auth-page"><section className="auth-card auth-card--wide"><div className="auth-card__intro"><span className="eyebrow">Join the competition</span><h1>Register</h1><p>Create your participant account and start building with an ENSAM InventIA team.</p></div><Form layout="vertical" onFinish={onFinish}><div className="form-grid"><Form.Item name="firstName" label="First Name" rules={[{required:true}]}><Input size="large" /></Form.Item><Form.Item name="lastName" label="Last Name" rules={[{required:true}]}><Input size="large" /></Form.Item></div><Form.Item name="username" label="Username" rules={[{required:true}]}><Input size="large" /></Form.Item><Form.Item name="email" label="Email" rules={[{required:true,type:'email'}]}><Input size="large" /></Form.Item><Form.Item name="password" label="Password" rules={[{required:true,min:6}]}><Input.Password size="large" /></Form.Item><Button type="primary" htmlType="submit" size="large" block>Create account</Button></Form></section></main>}
export function HackathonListPage(){
  const {hasRole}=useAuth();
  const [items,setItems]=useState([]);

  useEffect(()=>{hackathonService.list().then(r=>setItems(r.data.data.content)).catch(()=>setItems([]));},[]);

  const upcomingCount = items.filter(h => h.status === 'UPCOMING').length;
  const openCount = items.filter(h => h.status === 'UPCOMING' || h.status === 'ONGOING').length;

  return (
    <main className="hackathons-page">
      <section className="hackathons-hero">
        <h1>Upcoming AI Hackathons</h1>
        <p>
          Join ENSAM InventIA challenges built for teams designing practical AI, inventory intelligence,
          and full-stack products from idea to judged submission.
        </p>
        <div className="hackathons-hero__stats" aria-label="Hackathon summary">
          <span>{openCount} open</span>
          <span>{upcomingCount} upcoming</span>
          <span>{items.length} total</span>
        </div>
        {hasRole?.(['ROLE_MANAGER','ROLE_ADMIN']) && <Link className="primary" to="/hackathons/new"><Plus size={16}/>Create hackathon</Link>}
      </section>

      {items.length > 0 ? (
        <section className="hackathon-grid" aria-label="Hackathons">
          {items.map(h=><HackathonCard key={h.id} hackathon={h}/>)}
        </section>
      ) : (
        <section className="hackathons-empty">
          <h2>No hackathons yet</h2>
          <p>New challenges will appear here when they are published.</p>
        </section>
      )}
    </main>
  );
}

export function HackathonDetailPage() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [error, setError] = useState('');
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const fetchMyTeam = useCallback(() => {
    hackathonService.myTeam(id).then(res => setMyTeam(res.data.data)).catch(() => setMyTeam(null));
  }, [id]);

  useEffect(() => {
    hackathonService.get(id).then(res => setHackathon(res.data.data)).catch(() => {});

    if (hasRole?.(['ROLE_ADMIN', 'ROLE_MANAGER'])) {
      hackathonService.analytics(id).then(res => setAnalytics(res.data.data)).catch(err => {
        if(err.response?.status === 403) {
          setError('You can only view analytics for hackathons you created.');
        }
      });
    }

    if (user && !hasRole?.(['ROLE_ADMIN', 'ROLE_MANAGER'])) {
      fetchMyTeam();
    }
  }, [id, user, hasRole, fetchMyTeam]);

  const handleJoin = (values) => {
    teamService.join(values.joinCode).then(() => {
      message.success('Joined team');
      setJoinModalVisible(false);
      fetchMyTeam();
    }).catch(e => message.error(e.response?.data?.message || 'Failed to join'));
  };

  const handleCreateTeam = (values) => {
    teamService.create(id, values).then(() => {
      message.success('Team created');
      setCreateModalVisible(false);
      fetchMyTeam();
    }).catch(e => message.error(e.response?.data?.message || 'Failed to create team'));
  };

  const handleExport = async (type) => {
    try {
      const response = type === 'pdf' ? await exportService.pdf(id) : await exportService.excel(id);
      saveBlob(response.data, `inventia-hackathon-${id}.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
    } catch (e) {
      message.error(e.response?.data?.message || 'Export failed');
    }
  };

  return (
    <main className="detail-page">
      <section className="detail-hero">
        <div>
          <span className="eyebrow">{hackathon?.status || 'Hackathon'}</span>
          <h1>{hackathon?.title || 'Hackathon details'}</h1>
          <p>{hackathon?.description || 'Competition details will appear here when the hackathon is loaded.'}</p>
          <div className="detail-hero__meta">
            {hackathon?.startDate && <span><CalendarDays size={15}/>{formatPageDateRange(hackathon.startDate, hackathon.endDate)}</span>}
            {hackathon?.theme && <span><Rocket size={15}/>{hackathon.theme}</span>}
            {hackathon?.maxTeamSize && <span><Users size={15}/>Max {hackathon.maxTeamSize}/team</span>}
          </div>
        </div>
        <div className="detail-hero__poster" aria-hidden="true">
          <span>{hackathon?.theme || 'AI Challenge'}</span>
          <strong>{hackathon?.title || 'InventIA'}</strong>
        </div>
      </section>
      
      {hasRole?.(['ROLE_ADMIN', 'ROLE_MANAGER']) ? (
        <section className="workspace-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">Manager view</span>
              <h2>Analytics</h2>
            </div>
            <Dropdown menu={{ items: [
              { key: 'pdf', label: 'Export PDF' },
              { key: 'excel', label: 'Export Excel' }
            ], onClick: ({ key }) => handleExport(key) }}>
              <Button icon={<Download size={16}/>}>Export</Button>
            </Dropdown>
          </div>
          {error ? (
            <p className="danger-text">{error}</p>
          ) : analytics ? (
            <div className="kpis">
              <KpiCard label="Teams" value={analytics.totalTeams} />
              <KpiCard label="Participants" value={analytics.totalParticipants} />
              <KpiCard label="Submissions" value={analytics.totalSubmissions} />
            </div>
          ) : (
            <p>Loading analytics...</p>
          )}
        </section>
      ) : user ? (
        myTeam ? (
          <MyTeamDashboard team={myTeam} onTeamUpdate={fetchMyTeam} />
        ) : (
          <section className="workspace-card join-card">
            <span className="eyebrow">Team entry</span>
            <h2>Start competing with a team</h2>
            <p>Create a new team for this hackathon or join an existing team with an invite code.</p>
            <div className="action-row">
              <Button type="primary" size="large" icon={<UserPlus size={17}/>} onClick={() => setCreateModalVisible(true)}>Create Team</Button>
              <Button size="large" onClick={() => setJoinModalVisible(true)}>Join Team</Button>
            </div>
            
            <Modal title="Join Team" open={joinModalVisible} onCancel={() => setJoinModalVisible(false)} footer={null}>
              <Form layout="vertical" onFinish={handleJoin}>
                <Form.Item name="joinCode" label="Join Code" rules={[{ required: true }]}>
                  <Input placeholder="Enter the team's join code" />
                </Form.Item>
                <Button type="primary" htmlType="submit">Join</Button>
              </Form>
            </Modal>
            
            <Modal title="Create Team" open={createModalVisible} onCancel={() => setCreateModalVisible(false)} footer={null}>
              <Form layout="vertical" onFinish={handleCreateTeam}>
                <Form.Item name="name" label="Team Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name="techStack" label="Tech Stack">
                  <Input />
                </Form.Item>
                <Button type="primary" htmlType="submit">Create</Button>
              </Form>
            </Modal>
          </section>
        )
      ) : (
        <section className="workspace-card join-card">
          <span className="eyebrow">Participant access</span>
          <h2>Login to participate</h2>
          <p>Sign in to create or join a team for this hackathon.</p>
          <Button type="primary" size="large" onClick={() => navigate('/login')}>Participate</Button>
        </section>
      )}
    </main>
  );
}
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
    <main className="form-page">
      <section className="form-card">
      <div className="section-title">
        <div>
          <span className="eyebrow">Manager setup</span>
          <h1>Create hackathon</h1>
        </div>
      </div>
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
        <div className="form-grid">
          <Form.Item name="registrationDeadline" label="Registration Deadline" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div className="form-grid">
          <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maxTeamSize" label="Max Team Size" rules={[{ required: true }]}>
            <InputNumber min={2} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" loading={loading} size="large">
          Create
        </Button>
      </Form>
      </section>
    </main>
  );
}
export function TeamListPage(){return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">Teams</span><h1>Team workspace</h1><p>Team listings will appear here as competitions become active.</p></section></main>}
export function TeamDetailPage(){return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">Team</span><h1>Team details</h1><p>Team profile, members, and project activity will appear here.</p></section></main>}
export function SubmissionFormPage(){return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">Submission</span><h1>Project submission</h1><p>Use your hackathon team workspace to submit repository links, demos, and ZIP artifacts.</p></section></main>}
export function LeaderboardPage(){return <main className="simple-page"><section className="workspace-card"><div className="section-title"><div><span className="eyebrow">Competition ranking</span><h1>Leaderboard</h1></div><Trophy size={34}/></div><LeaderboardTable rows={[]} /></section></main>}
export function ScoringPage(){return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">Jury</span><h1>Scoring</h1><p>Evaluate projects against the competition criteria.</p></section></main>}
export function DashboardPage(){const [s,setS]=useState(null); useEffect(()=>{dashboardService.manager().then(r=>setS(r.data.data)).catch(()=>{});},[]); const data=[{name:'Users',value:s?.totalUsers||0},{name:'Hackathons',value:s?.totalHackathons||0},{name:'Teams',value:s?.totalTeams||0}]; return <main className="dashboard-page"><section className="dashboard-hero"><div><span className="eyebrow">Operations command center</span><h1><BarChart3/>Dashboard</h1><p>Monitor platform activity across hackathons, teams, users, and submissions.</p></div></section><div className="kpis"><KpiCard label="Users" value={s?.totalUsers||0}/><KpiCard label="Hackathons" value={s?.totalHackathons||0}/><KpiCard label="Teams" value={s?.totalTeams||0}/><KpiCard label="Submissions" value={s?.totalSubmissions||0}/></div><div className="charts"><section><div className="section-title"><div><span className="eyebrow">Activity</span><h2>Submission rate</h2></div></div><SubmissionRateChart data={data}/></section><section><div className="section-title"><div><span className="eyebrow">Scores</span><h2>Distribution</h2></div></div><ScoreDistributionChart data={data}/></section></div></main>}
export function UserDashboardPage(){return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">Participant</span><h1>My work</h1><p>Your active teams, submissions, and hackathon progress will appear here.</p></section></main>}
export function AdminUserManagementPage(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userService.list();
      setUsers(data.data.content || []);
    } catch {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleCreateUser = async (values) => {
    try {
      await userService.create(values);
      message.success('User created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (e) {
      message.error(e.response?.data?.message || 'Failed to create user');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await userService.updateRole(id, role);
      message.success('Role updated');
      fetchUsers();
    } catch {
      message.error('Failed to update role');
    }
  };

  const handleEnable = async (id) => {
    try {
      await userService.enable(id);
      message.success('User enabled');
      fetchUsers();
    } catch (e) {
      message.error(e.response?.data?.message || 'Failed to enable user');
    }
  };

  const handleDisable = async (id) => {
    try {
      await userService.disable(id);
      message.success('User disabled');
      fetchUsers();
    } catch (e) {
      message.error(e.response?.data?.message || 'Failed to disable user');
    }
  };

  const columns = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Select
          value={role}
          style={{ width: 150 }}
          onChange={(val) => handleRoleChange(record.id, val)}
          options={[
            { value: 'ROLE_PARTICIPANT', label: 'Participant' },
            { value: 'ROLE_MANAGER', label: 'Manager' },
            { value: 'ROLE_ADMIN', label: 'Admin' },
          ]}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (enabled ? 'Active' : 'Disabled'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.enabled ? (
          <Popconfirm
            title="Disable user?"
            onConfirm={() => handleDisable(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">Disable</Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Enable user?"
            onConfirm={() => handleEnable(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" size="small">Enable</Button>
          </Popconfirm>
        )
      ),
    },
  ];

  const filteredUsers = users.filter((u) => {
    const search = searchQuery.toLowerCase();
    const matchSearch =
      (u.username || '').toLowerCase().includes(search) ||
      (u.email || '').toLowerCase().includes(search) ||
      (u.firstName || '').toLowerCase().includes(search) ||
      (u.lastName || '').toLowerCase().includes(search);
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <main className="admin-page">
      <div className="pagehead pagehead--modern">
        <div>
          <span className="eyebrow">Admin console</span>
          <h1><ShieldCheck size={42}/>User management</h1>
          <p>Manage roles and access for participants, managers, and administrators.</p>
        </div>
        <Button type="primary" size="large" onClick={() => setIsModalVisible(true)}><Plus size={16}/> Create user</Button>
      </div>
      <div className="toolbar">
        <Input.Search
          placeholder="Search by name, username, email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Filter by role"
          value={roleFilter}
          onChange={setRoleFilter}
          allowClear
          options={[
            { value: '', label: 'All Roles' },
            { value: 'ROLE_PARTICIPANT', label: 'Participant' },
            { value: 'ROLE_MANAGER', label: 'Manager' },
            { value: 'ROLE_ADMIN', label: 'Admin' },
          ]}
        />
      </div>
      <section className="table-card">
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </section>
      <Modal
        title="Create User"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleCreateUser}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}><Input.Password /></Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={[
              { value: 'ROLE_PARTICIPANT', label: 'Participant' },
              { value: 'ROLE_MANAGER', label: 'Manager' }
            ]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Create</Button>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
export function ProfilePage(){const {user}=useAuth(); return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">Account</span><h1>Profile</h1><p>{user?.email}</p></section></main>}
export function NotFoundPage(){return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">404</span><h1>Not found</h1><p>The page you are looking for does not exist.</p><Link className="primary" to="/hackathons">View hackathons</Link></section></main>}
export function UnauthorizedPage(){return <main className="simple-page"><section className="workspace-card"><span className="eyebrow">Access</span><h1>Unauthorized</h1><p>You do not have permission to open this workspace.</p><Link className="primary" to="/hackathons">View hackathons</Link></section></main>}
