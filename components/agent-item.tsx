'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAgent } from '@/lib/context/agent-context';
import { generateUUID } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';
import { SidebarToggle } from './sidebar-toggle';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 定义单个代理项的属性接口
interface AgentItemProps {
  name?: string;
  author?: string;
  description?: string;
  price?: number;
  usageCount?: number;
  apiCount?: number;
  tags?: string[];
  onClick?: () => void;
  image_url?: string;
  total_calls?: number;
}

// 代理项数据模型
export interface Agent {
  id: string;
  name: string;
  author: string;
  description: string;
  tags: string[];
  image_url?: string;
  total_calls?: number;
  recommended?: boolean;
}

// 修改API获取函数，使用服务端请求而非前端直接请求
const fetchAgents = async (): Promise<any[]> => {
  try {
    // 替换为通过自己的API端点请求数据
    const response = await fetch('/api/agents');
    const data = await response.json();

    // 如果您的API返回格式与原始格式相同，则保持以下处理逻辑
    const agents = data.agents;

    // 将获取的数据转换为Agent对象数组
    if (agents && typeof agents === 'object') {
      // 如果data是一个对象而不是数组，需要将其转换为数组
      const agentsArray = Object.keys(agents).map((key) => {
        const agent = agents[key];
        // 确保metadata存在，并包含所需的字段
        const metadata = {
          id: key,
          name: 'Unnamed Agent',
          author: 'Heurist',
          description: '',
          tags: [],
          image_url: '',
          recommended: false,
        };
        return Object.assign(metadata, agent.metadata);
      });
      // 按照total_calls从高到低排序
      agentsArray.sort((a, b) => {
        const callsA = a.total_calls || 0;
        const callsB = b.total_calls || 0;
        return callsB - callsA;
      });
      const filteredAgents = agentsArray.filter(
        (item) => item.name && !(item as any).hidden,
      );
      console.log('filteredAgents --', filteredAgents);
      return filteredAgents;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return [];
  }
};

// 单个代理项组件
const AgentItemCard: FC<AgentItemProps> = ({
  name = 'Name',
  author = 'Heurist',
  description = 'A cutting-edge AI agent designed to scour blockchain networks for emerging memecoins. Leveraging real-time data analysis, it identifies potential opportunities before they gain mainstream attention.',
  price = 1,
  usageCount = 0,
  apiCount = 2,
  tags = ['Tag'],
  onClick,
  image_url,
  total_calls = 0,
}) => {
  return (
    <Card className="p-1 border-none h-full max-w-[500px]">
      <div className="rounded-md border-solid h-full flex flex-col justify-between border text-white overflow-hidden">
        <CardContent className="p-3">
          {/* 头部：头像、名称、作者和标签 */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar className="size-10 rounded-lg">
                  <AvatarImage src={image_url} />
                  <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <h3 className="font-medium text-lg">{name}</h3>
                <p className="text-xs text-muted-foreground">By {author}</p>
              </div>
            </div>

            <div className="flex gap-1">
              {tags.map((tag) => (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-300"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 描述文本 */}
          <p className="text-sm text-foreground line-clamp-2">{description}</p>
        </CardContent>

        {/* 底部：价格、使用次数、API 和箭头按钮 */}
        <CardFooter className="m-3 p-3 rounded-lg flex justify-between items-center bg-muted">
          <div className="flex flex-1 gap-4 text-xs items-center">
            <div className="grow-[4]">
              <p className="text-muted-foreground">Price per Use</p>
              <p className="font-medium text-foreground">
                {price} {price === 1 ? 'Credit' : 'Credits'}
              </p>
            </div>

            {/* 第一个分隔线 */}
            <div className="h-8 w-px bg-secondary" />

            <div className="grow-[3]">
              <p className="text-muted-foreground">Used</p>
              <p className="font-medium text-foreground">
                {total_calls.toLocaleString()}x
              </p>
            </div>

            {/* 第二个分隔线 */}
            {/* <div className="h-8 w-px bg-secondary"></div>

            <div className="grow-[2]">
              <p className="text-muted-foreground">APIs</p>
              <div className="flex gap-1 mt-1 text-foreground">
                {Array(apiCount)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      className="size-4 rounded-full border border-white"
                    />
                  ))}
              </div>
            </div> */}

            {/* 第三个分隔线 */}
            <div className="h-8 w-px bg-secondary" />

            <div className="shrink-0">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  className="size-8 group -rotate-45 bg-[#cdf138] hover:bg-[#cdf138] rounded-full  "
                  onClick={onClick}
                >
                  <ArrowRight className="size-4 text-zinc-600 duration-150 group-hover:rotate-45" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

// 主组件 - 代理项容器
export const AgentItem: FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [recommendedAgents, setRecommendedAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setSelectedAgent } = useAgent();
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        const data = await fetchAgents();
        setAgents(data);
        setRecommendedAgents(data.filter((agent) => agent.recommended));
      } catch (err) {
        console.error('Failed to load agents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  // 修改handleAgentClick函数
  const handleAgentClick = async (agent: any) => {
    const chatId = generateUUID();
    try {
      // 创建新的聊天记录
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `${chatId}-${agent.id}`,
          title: agent.name, // 使用代理名称作为初始标题
          agentId: agent.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat');
      }
      console.log('agent --', agent);
      // 跳转到聊天页面
      // 新增状态存储
      setSelectedAgent(agent);

      router.push(`/chat/${chatId}-${agent.id}?agent=${agent.id}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
      // 可以添加错误提示
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-2 md:p-10 pt-14">
      <div className="absolute top-2 left-2 flex md:hidden flex-row justify-end items-center">
        <SidebarToggle />
      </div>

      <Tabs defaultValue="all agent" className="w-full p-2">
        <TabsList className="grid grid-cols-2 w-full md:w-[300px]">
          <TabsTrigger value="all agent">
            <Users className="size-4 mr-2" />
            All Agents
          </TabsTrigger>
          <TabsTrigger value="recommended">
            <Trophy className="size-4 mr-2" />
            Recommended
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all agent" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{
                    duration: 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <AgentItemCard
                    name={agent.name}
                    author={agent.author}
                    description={agent.description}
                    tags={agent.tags}
                    image_url={agent.image_url}
                    total_calls={agent.total_calls}
                    onClick={() => handleAgentClick(agent)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
        <TabsContent value="recommended" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {recommendedAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{
                    duration: 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <AgentItemCard
                    name={agent.name}
                    author={agent.author}
                    description={agent.description}
                    tags={agent.tags}
                    image_url={agent.image_url}
                    total_calls={agent.total_calls}
                    onClick={() => handleAgentClick(agent)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
