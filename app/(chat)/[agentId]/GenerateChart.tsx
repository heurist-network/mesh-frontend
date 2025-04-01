'use client';
import { generateUUID } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export function GenerateChart({ agentId }: { agentId: string }) {
  const router = useRouter();
  const fetchData = ({ agentId }: { agentId: string }) => {
    const id = generateUUID();
    fetch('/api/chat/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `${id}-${agentId}`,
        title: agentId, // 使用代理名称作为初始标题
        agentId: agentId,
      }),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log('data--', data);
        router.push(`/${id}-${agentId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    console.log('GenerateChart');
    fetchData({ agentId });
  });
  return (
    <div className="flex justify-center items-center h-dvh">Generating...</div>
  );
}
