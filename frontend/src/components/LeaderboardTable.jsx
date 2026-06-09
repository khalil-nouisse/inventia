import { Table, Tag } from 'antd';

export default function LeaderboardTable({rows=[]}){
  return (
    <Table
      rowKey={(row) => row.teamId || row.rank}
      dataSource={rows}
      pagination={false}
      columns={[
        { title:'Rank', dataIndex:'rank', width: 110, render: (rank) => <Tag color={rank === 1 ? 'gold' : 'blue'}>#{rank}</Tag> },
        { title:'Team', dataIndex:'teamName' },
        { title:'Average score', dataIndex:'averageScore', render: (score) => Number(score || 0).toFixed(2) },
      ]}
    />
  );
}
