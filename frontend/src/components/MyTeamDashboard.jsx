import { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button, List, message, Space, Card, Modal, Typography, Upload } from 'antd';
import { teamService } from '../services/teamService';
import { submissionService } from '../services/submissionService';
import { Download, FileArchive, Trash2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveBlob } from '../services/exportService';

const { Text, Paragraph } = Typography;
const MAX_ZIP_SIZE_MB = 200;

const apiError = (error, fallback = 'Error') => (
  error.response?.data?.error || error.response?.data?.message || fallback
);

export function MyTeamDashboard({ team, onTeamUpdate }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [submission, setSubmission] = useState(null);
  const [artifact, setArtifact] = useState([]);
  
  const isLeader = team.members.some(m => m.user.id === user.id && m.memberRole === 'LEADER');
  const isMember = team.members.some(m => m.user.id === user.id);

  const fetchChat = useCallback(() => {
    teamService.getChat(team.id).then(res => setMessages(res.data.data)).catch(() => {});
  }, [team.id]);

  const fetchSubmission = useCallback(() => {
    submissionService.get(team.id).then(res => setSubmission(res.data.data)).catch(() => setSubmission(null));
  }, [team.id]);

  useEffect(() => {
    fetchChat();
    fetchSubmission();
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, [fetchChat, fetchSubmission]);

  const handleSendMessage = () => {
    if(!messageText.trim()) return;
    teamService.sendChat(team.id, messageText).then(() => {
      setMessageText('');
      fetchChat();
    });
  };

  const handleSubmission = (values) => {
    const file = artifact[0]?.originFileObj;
    if (!submission && !file) {
      message.error('Upload a ZIP archive before submitting');
      return;
    }
    const request = submission ? submissionService.update : submissionService.save;
    request(team.id, values, file).then(() => {
      message.success('Submission saved');
      setArtifact([]);
      fetchSubmission();
    }).catch(e => message.error(apiError(e)));
  };

  const handleDownloadArtifact = async () => {
    try {
      const res = await submissionService.download(team.id);
      saveBlob(res.data, submission.artifactFileName || 'submission.zip');
    } catch (e) {
      message.error(apiError(e, 'Download failed'));
    }
  };

  const handleDeleteSubmission = () => {
    submissionService.delete(team.id).then(() => {
      message.success('Submission deleted');
      fetchSubmission();
    }).catch(e => message.error(apiError(e)));
  };

  const handleDeleteTeam = () => {
    Modal.confirm({
      title: 'Delete Team',
      content: 'Are you sure? This cannot be undone.',
      onOk: () => {
        teamService.delete(team.id).then(() => {
          message.success('Team deleted');
          onTeamUpdate();
        }).catch(e => message.error(apiError(e)));
      }
    });
  };

  return (
    <section className="team-workspace">
      <div className="team-workspace__main">
        <Card className="workspace-card ant-workspace-card" title={<span>Team: {team.name}</span>}>
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
                {m.user.username} {m.memberRole === 'LEADER' && <Text type="secondary">(Leader)</Text>}
              </List.Item>
            )}
          />
          {isLeader && (
            <Button danger icon={<Trash2 size={16}/>} onClick={handleDeleteTeam} style={{ marginTop: '1rem' }}>
              Delete Team
            </Button>
          )}
        </Card>

        <Card className="workspace-card ant-workspace-card" title={<span>Submission</span>}>
          {submission ? (
            <div className="submission-summary">
              <p><strong>Title:</strong> {submission.title}</p>
              <p><strong>Description:</strong> {submission.description}</p>
              <p><strong>Repository:</strong> <a href={submission.repositoryUrl} target="_blank" rel="noreferrer">{submission.repositoryUrl}</a></p>
              {submission.demoUrl && <p><strong>Demo:</strong> <a href={submission.demoUrl} target="_blank" rel="noreferrer">{submission.demoUrl}</a></p>}
              <p><strong>Artifact:</strong> {submission.artifactFileName} ({Math.ceil((submission.artifactSize || 0) / 1024)} KB)</p>
              <Space>
                <Button icon={<Download size={16}/>} onClick={handleDownloadArtifact}>Download ZIP</Button>
                {isLeader && <Button danger onClick={handleDeleteSubmission}>Delete Submission</Button>}
              </Space>
              {isLeader && (
                null
              )}
            </div>
          ) : (
            <p>No submission yet.</p>
          )}
          {isMember && (
            <Form layout="vertical" onFinish={handleSubmission} initialValues={submission}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
              <Form.Item name="repositoryUrl" label="Repo URL"><Input /></Form.Item>
              <Form.Item name="demoUrl" label="Demo URL"><Input /></Form.Item>
              <Form.Item name="techStack" label="Tech Stack"><Input /></Form.Item>
              <Form.Item label={submission ? 'Replace ZIP artifact' : 'Project ZIP artifact'} required={!submission}>
                <Upload
                  accept=".zip,application/zip,application/x-zip-compressed"
                  beforeUpload={(file) => {
                    if (!file.name.toLowerCase().endsWith('.zip')) {
                      message.error('Only .zip files are accepted');
                      return Upload.LIST_IGNORE;
                    }
                    if (file.size > MAX_ZIP_SIZE_MB * 1024 * 1024) {
                      message.error(`ZIP file must be ${MAX_ZIP_SIZE_MB}MB or smaller`);
                      return Upload.LIST_IGNORE;
                    }
                    setArtifact([{ ...file, originFileObj: file }]);
                    return false;
                  }}
                  fileList={artifact}
                  maxCount={1}
                  onRemove={() => setArtifact([])}
                >
                  <Button icon={<FileArchive size={16}/>}>Select ZIP</Button>
                </Upload>
              </Form.Item>
              <Button type="primary" htmlType="submit">Save Submission</Button>
            </Form>
          )}
        </Card>
      </div>

      <div className="team-workspace__chat">
        <Card className="workspace-card ant-workspace-card chat-card" title={<span>Secure Team Chat</span>} bodyStyle={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div className="chat-feed">
            <List
              dataSource={messages}
              renderItem={msg => (
                <List.Item className={msg.sender.id === user.id ? 'chat-message chat-message--mine' : 'chat-message'}>
                  <div>
                    <span>{msg.sender.username}</span>
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
    </section>
  );
}
