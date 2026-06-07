import { useState, useEffect } from 'react';
import { Form, Input, Button, List, message, Space, Card, Modal, Typography } from 'antd';
import { teamService } from '../services/teamService';
import { submissionService } from '../services/submissionService';
import { Trash2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const { Text, Paragraph } = Typography;

export function MyTeamDashboard({ team, onTeamUpdate }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [submission, setSubmission] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const isLeader = team.members.some(m => m.user.id === user.id && m.role === 'LEADER');

  const fetchChat = () => {
    teamService.getChat(team.id).then(res => setMessages(res.data.data)).catch(console.error);
  };

  const fetchSubmission = () => {
    submissionService.get(team.id).then(res => setSubmission(res.data.data)).catch(() => setSubmission(null));
  };

  useEffect(() => {
    fetchChat();
    fetchSubmission();
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, [team.id]);

  const handleSendMessage = () => {
    if(!messageText.trim()) return;
    teamService.sendChat(team.id, messageText).then(() => {
      setMessageText('');
      fetchChat();
    });
  };

  const handleSubmission = (values) => {
    submissionService.save(team.id, values).then(() => {
      message.success('Submission saved');
      fetchSubmission();
    }).catch(e => message.error(e.response?.data?.message || 'Error'));
  };

  const handleDeleteSubmission = () => {
    submissionService.delete(team.id).then(() => {
      message.success('Submission deleted');
      fetchSubmission();
    }).catch(e => message.error(e.response?.data?.message || 'Error'));
  };

  const handleDeleteTeam = () => {
    Modal.confirm({
      title: 'Delete Team',
      content: 'Are you sure? This cannot be undone.',
      onOk: () => {
        teamService.delete(team.id).then(() => {
          message.success('Team deleted');
          onTeamUpdate();
        }).catch(e => message.error(e.response?.data?.message || 'Error'));
      }
    });
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
      <div style={{ flex: 1 }}>
        <Card title={`Team: ${team.name}`} style={{ marginBottom: '1rem' }}>
          <p>{team.description}</p>
          <Paragraph>
            <Text strong>Join Code (Share with others): </Text>
            <Text copyable>{team.joinCode}</Text>
          </Paragraph>
          <h3>Members</h3>
          <List
            size="small"
            dataSource={team.members}
            renderItem={m => (
              <List.Item>
                {m.user.username} {m.role === 'LEADER' && <Text type="secondary">(Leader)</Text>}
              </List.Item>
            )}
          />
          {isLeader && (
            <Button danger icon={<Trash2 size={16}/>} onClick={handleDeleteTeam} style={{ marginTop: '1rem' }}>
              Delete Team
            </Button>
          )}
        </Card>

        <Card title="Submission">
          {submission ? (
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Title:</strong> {submission.title}</p>
              <p><strong>Description:</strong> {submission.description}</p>
              <p><strong>Repository:</strong> <a href={submission.repositoryUrl} target="_blank" rel="noreferrer">{submission.repositoryUrl}</a></p>
              <p><strong>Demo:</strong> <a href={submission.demoUrl} target="_blank" rel="noreferrer">{submission.demoUrl}</a></p>
              {isLeader && (
                <Button danger onClick={handleDeleteSubmission}>Delete Submission</Button>
              )}
            </div>
          ) : (
            <p>No submission yet.</p>
          )}
          {isLeader && (
            <Form layout="vertical" onFinish={handleSubmission} initialValues={submission}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
              <Form.Item name="repositoryUrl" label="Repo URL"><Input /></Form.Item>
              <Form.Item name="demoUrl" label="Demo URL"><Input /></Form.Item>
              <Form.Item name="techStack" label="Tech Stack"><Input /></Form.Item>
              <Button type="primary" htmlType="submit">Save Submission</Button>
            </Form>
          )}
        </Card>
      </div>

      <div style={{ flex: 1 }}>
        <Card title="Secure Team Chat" bodyStyle={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
            <List
              dataSource={messages}
              renderItem={msg => (
                <List.Item style={{ justifyContent: msg.sender.id === user.id ? 'flex-end' : 'flex-start', border: 'none', padding: '4px 0' }}>
                  <div style={{ 
                    background: msg.sender.id === user.id ? '#1890ff' : '#f0f2f5', 
                    color: msg.sender.id === user.id ? 'white' : 'black',
                    padding: '8px 12px', borderRadius: '12px', maxWidth: '80%'
                  }}>
                    <div style={{ fontSize: '10px', marginBottom: '4px', opacity: 0.8 }}>{msg.sender.username}</div>
                    {msg.content}
                  </div>
                </List.Item>
              )}
            />
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <Input 
              value={messageText} 
              onChange={e => setMessageText(e.target.value)} 
              onPressEnter={handleSendMessage}
              placeholder="Type a message..." 
            />
            <Button type="primary" icon={<Send size={16}/>} onClick={handleSendMessage} />
          </Space.Compact>
        </Card>
      </div>
    </div>
  );
}
