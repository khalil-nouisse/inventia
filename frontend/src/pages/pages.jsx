import { Button, Form, Input, DatePicker, InputNumber, message, Table, Select, Popconfirm, Modal } from 'antd'; import { useEffect, useState } from 'react'; import { Link, useNavigate, useParams } from 'react-router-dom'; import { BarChart3, Download, Plus } from 'lucide-react'; import HackathonCard from '../components/HackathonCard'; import KpiCard from '../components/KpiCard'; import LeaderboardTable from '../components/LeaderboardTable'; import SubmissionRateChart from '../components/SubmissionRateChart'; import ScoreDistributionChart from '../components/ScoreDistributionChart'; import { useAuth } from '../context/AuthContext'; import { hackathonService } from '../services/hackathonService'; import { dashboardService } from '../services/dashboardService'; import { userService } from '../services/userService';
import { MyTeamDashboard } from '../components/MyTeamDashboard';
import { teamService } from '../services/teamService';
export function LandingPage(){return <main className="hero"><section><img src="/assets/logo-dark.png" alt="InventIA" className="logo" /><h1>Hackathon operations for ENSAM teams</h1><p>Manage registrations, teams, submissions, scores, leaderboards, and exports from one role-protected workspace.</p><Link className="primary" to="/hackathons">View hackathons</Link></section></main>}
export function LoginPage(){const {login}=useAuth(); const navigate=useNavigate(); const onFinish=async(v)=>{try{const u=await login(v); if(u?.role==='ROLE_ADMIN') navigate('/dashboard'); else navigate('/hackathons');}catch{message.error('Login failed');}}; return <main className="panel"><h1>Login</h1><Form layout="vertical" onFinish={onFinish}><Form.Item name="email" label="Email" rules={[{required:true}]}><Input /></Form.Item><Form.Item name="password" label="Password" rules={[{required:true}]}><Input.Password /></Form.Item><Button type="primary" htmlType="submit">Login</Button></Form></main>}
export function RegisterPage(){const {register}=useAuth(); const navigate=useNavigate(); const onFinish=async(v)=>{try{await register(v); navigate('/hackathons');}catch{message.error('Registration failed');}}; return <main className="panel"><h1>Register</h1><Form layout="vertical" onFinish={onFinish}><Form.Item name="firstName" label="First Name" rules={[{required:true}]}><Input /></Form.Item><Form.Item name="lastName" label="Last Name" rules={[{required:true}]}><Input /></Form.Item><Form.Item name="username" label="Username" rules={[{required:true}]}><Input /></Form.Item><Form.Item name="email" label="Email" rules={[{required:true,type:'email'}]}><Input /></Form.Item><Form.Item name="password" label="Password" rules={[{required:true,min:6}]}><Input.Password /></Form.Item><Button type="primary" htmlType="submit">Create account</Button></Form></main>}
export function HackathonListPage(){const {hasRole}=useAuth(); const [items,setItems]=useState([]); useEffect(()=>{hackathonService.list().then(r=>setItems(r.data.data.content)).catch(()=>setItems([]));},[]); return <main><div className="pagehead"><h1>Hackathons</h1>{hasRole?.(['ROLE_MANAGER','ROLE_ADMIN']) && <Link className="primary" to="/hackathons/new"><Plus size={16}/>Create</Link>}</div><div className="grid">{items.map(h=><HackathonCard key={h.id} hackathon={h}/>)}</div></main>}

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

  useEffect(() => {
    hackathonService.get(id).then(res => setHackathon(res.data.data)).catch(console.error);

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
  }, [id, user, hasRole]);

  const fetchMyTeam = () => {
    hackathonService.myTeam(id).then(res => setMyTeam(res.data.data)).catch(() => setMyTeam(null));
  };

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

  return (
    <main className="panel">
      <h1>{hackathon?.title || 'Hackathon details'}</h1>
      <p>{hackathon?.description}</p>
      
      {hasRole?.(['ROLE_ADMIN', 'ROLE_MANAGER']) ? (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h3>Analytics</h3>
          {error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : analytics ? (
            <div className="kpis">
              <KpiCard label="Teams" value={analytics.totalTeams} />
              <KpiCard label="Participants" value={analytics.totalParticipants} />
              <KpiCard label="Submissions" value={analytics.totalSubmissions} />
            </div>
          ) : (
            <p>Loading analytics...</p>
          )}
          <Button icon={<Download size={16}/>}>Export</Button>
        </div>
      ) : user ? (
        myTeam ? (
          <MyTeamDashboard team={myTeam} onTeamUpdate={fetchMyTeam} />
        ) : (
          <div style={{ marginTop: 20 }}>
            <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ marginRight: 16 }}>Create Team</Button>
            <Button onClick={() => setJoinModalVisible(true)}>Join Team</Button>
            
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
          </div>
        )
      ) : (
        <Button type="primary" onClick={() => navigate('/login')}>Participate</Button>
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
    <main>
      <div className="pagehead">
        <h1>User management</h1>
        <Button type="primary" onClick={() => setIsModalVisible(true)}><Plus size={16}/> Create user</Button>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input.Search
          placeholder="Search by name, username, email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Filter by role"
          value={roleFilter}
          onChange={setRoleFilter}
          style={{ width: 150 }}
          allowClear
          options={[
            { value: '', label: 'All Roles' },
            { value: 'ROLE_PARTICIPANT', label: 'Participant' },
            { value: 'ROLE_MANAGER', label: 'Manager' },
            { value: 'ROLE_ADMIN', label: 'Admin' },
          ]}
        />
      </div>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
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
export function ProfilePage(){const {user}=useAuth(); return <main className="panel"><h1>Profile</h1><p>{user?.email}</p></main>}
export function NotFoundPage(){return <main className="panel"><h1>Not found</h1></main>}
export function UnauthorizedPage(){return <main className="panel"><h1>Unauthorized</h1></main>}
