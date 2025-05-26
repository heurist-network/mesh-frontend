'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { Agent } from '@/lib/provisioner-context';
import { useProvisioner } from '@/lib/provisioner-context';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Trophy,
  Users,
  PackageOpen,
  Search,
  Filter,
  Tag,
  Star,
  Check,
  Info,
  Plus,
  X,
  Wrench,
} from 'lucide-react';
import { type FC, useEffect, useState, useMemo } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface AgentListItemProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onShowDetails: (agent: Agent) => void;
  willBeAdded?: boolean;
  willBeRemoved?: boolean;
}

const AgentListItem: FC<AgentListItemProps> = ({
  agent,
  isSelected,
  onSelect,
  onShowDetails,
  willBeAdded,
  willBeRemoved,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`border rounded-md p-3 flex items-center gap-3 group cursor-pointer ${
        isSelected
          ? 'bg-primary/5 border-primary/20'
          : 'bg-card border-border hover:border-primary/20'
      } ${willBeAdded ? 'ring-2 ring-green-500/30' : ''} ${willBeRemoved ? 'ring-2 ring-red-500/30' : ''}`}
    >
      <div className="shrink-0">
        <div className="size-10 rounded-md border overflow-hidden flex items-center justify-center">
          {agent.image_url ? (
            <Image
              src={agent.image_url}
              alt={agent.name}
              width={40}
              height={40}
              className="size-full object-cover"
              priority
            />
          ) : (
            <div className="size-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {agent.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="grow min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center flex-wrap gap-1">
          <h3 className="text-sm font-medium leading-none truncate mr-1">
            {agent.name}
          </h3>
          {agent.credits === 0 ? (
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-600 border-green-500/20 px-1.5 py-0 h-4 text-[10px] font-medium"
            >
              Free!
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 px-1.5 py-0 h-4 text-[10px]"
            >
              {agent.credits !== undefined
                ? `${agent.credits} credit/use${agent.credits !== 1 ? 's' : ''}`
                : '1 credit/use'}
            </Badge>
          )}
          {agent.recommended && (
            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] px-1 py-0 h-4"
            >
              <Star className="size-2.5 mr-0.5" /> Recommended
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {agent.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex gap-1 flex-wrap">
            {agent.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-1 py-0 h-4 text-[10px] bg-secondary/50"
              >
                {tag}
              </Badge>
            ))}
            {agent.tags.length > 2 && (
              <Badge variant="outline" className="px-1 py-0 h-4 text-[10px]">
                +{agent.tags.length - 2}
              </Badge>
            )}
          </div>
          {agent.total_calls !== undefined && (
            <span className="text-[10px] text-muted-foreground shrink-0">
              {agent.total_calls.toLocaleString()} uses
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-full opacity-60 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onShowDetails(agent);
          }}
        >
          <Info className="size-3.5" />
        </Button>

        <Button
          className={`size-7 rounded-full flex items-center justify-center transition-colors ${
            isSelected
              ? willBeRemoved
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-primary-foreground'
              : willBeAdded
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(agent.id);
          }}
        >
          {isSelected ? (
            willBeRemoved ? (
              <X className="size-4" />
            ) : (
              <Check className="size-4" />
            )
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const AgentDetailModal: FC<{
  agent: Agent | null;
  onClose: () => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  willBeAdded?: boolean;
  willBeRemoved?: boolean;
}> = ({ agent, onClose, onSelect, isSelected, willBeAdded, willBeRemoved }) => {
  if (!agent) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-card border rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-md overflow-hidden flex items-center justify-center border border-border/30">
                {agent.image_url ? (
                  <Image
                    src={agent.image_url}
                    alt={agent.name}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                    priority
                  />
                ) : (
                  <div className="size-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {agent.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{agent.name}</h2>
                <p className="text-sm text-muted-foreground">
                  By {agent.author}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </div>

          <p className="text-sm mb-4">{agent.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {agent.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {agent.tools && agent.tools.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <span className="bg-primary/10 p-1 rounded-md inline-flex">
                  <Wrench className="size-4 text-primary" />
                </span>
                Tools ({agent.tools.length})
              </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {agent.tools.map((tool: any, toolIndex: number) => (
                  <div
                    key={`tool-${toolIndex}-${tool.function?.name || tool.name}`}
                    className="bg-muted/50 rounded-md p-2.5 text-xs"
                  >
                    <div className="font-medium mb-1">
                      {tool.function?.name || tool.name}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {tool.function?.description || tool.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              Used {agent.total_calls?.toLocaleString() || 0} times
            </div>
            <Button
              className={`${
                isSelected
                  ? willBeRemoved
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-red-500 hover:bg-red-600'
                  : willBeAdded
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-primary hover:bg-primary/90'
              }`}
              onClick={() => onSelect(agent.id)}
            >
              {isSelected
                ? willBeRemoved
                  ? 'Confirm Removal'
                  : 'Remove Agent'
                : willBeAdded
                  ? 'Cancel Addition'
                  : 'Add Agent'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AgentItem: FC = () => {
  const {
    isAgentSelected,
    toggleAgentSelection,
    allAgentsArray,
    refreshAgents,
    selectedAgents,
    activeServer,
    agentsToAdd,
    agentsToRemove,
  } = useProvisioner();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewType, setViewType] = useState<'all' | 'recommended' | 'free'>(
    'all',
  );
  const [detailAgent, setDetailAgent] = useState<Agent | null>(null);

  const { state } = useSidebar();

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        if (allAgentsArray.length === 0) {
          await refreshAgents();
        }
      } catch (err) {
        console.error('Failed to load agents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [allAgentsArray.length, refreshAgents]);

  const uniqueTags = useMemo(() => {
    const allTags = allAgentsArray.flatMap((agent) => agent.tags);
    return [...new Set(allTags)].sort();
  }, [allAgentsArray]);

  const uniqueAuthors = useMemo(() => {
    const authors = allAgentsArray.map((agent) => agent.author);
    return [...new Set(authors)].sort();
  }, [allAgentsArray]);

  const filteredAgents = useMemo(() => {
    let result = allAgentsArray;

    if (viewType === 'recommended') {
      result = result.filter((agent) => agent.recommended);
    } else if (viewType === 'free') {
      result = result.filter((agent) => agent.credits === 0);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (agent) =>
          agent.name.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query) ||
          agent.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (selectedTag) {
      result = result.filter((agent) => agent.tags.includes(selectedTag));
    }

    if (selectedAuthor) {
      result = result.filter((agent) => agent.author === selectedAuthor);
    }

    return result;
  }, [allAgentsArray, searchQuery, selectedTag, selectedAuthor, viewType]);

  const selectedCount = selectedAgents.length;

  if (loading) {
    return (
      <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card/80 to-card">
        <CardHeader className="p-6 sm:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <PackageOpen className="size-5 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Step 2. Select your agents
            </CardTitle>
          </div>
          <CardDescription className="text-base text-muted-foreground/90 pl-[52px]">
            Add agents to your MCP server
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:px-8">
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-52 bg-muted rounded mb-4" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card/80 to-card"
      data-agent-selection
    >
      <CardHeader className="p-6 sm:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <PackageOpen className="size-5 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Step 2. Select your agents
          </CardTitle>
        </div>
        <CardDescription className="text-base text-muted-foreground/90 pl-[52px]">
          Add agents to your MCP server
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pt-0 pb-6">
        <div className="bg-card mb-6 border rounded-lg p-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewType === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-9"
                onClick={() => setViewType('all')}
              >
                <Users className="mr-1.5 size-3.5" />
                All
              </Button>
              <Button
                variant={viewType === 'free' ? 'default' : 'outline'}
                size="sm"
                className="h-9"
                onClick={() => setViewType('free')}
              >
                <Star className="mr-1.5 size-3.5" />
                Free
              </Button>
              <Button
                variant={viewType === 'recommended' ? 'default' : 'outline'}
                size="sm"
                className="h-9"
                onClick={() => setViewType('recommended')}
              >
                <Trophy className="mr-1.5 size-3.5" />
                Recommended
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`size-9 ${showFilters ? 'bg-primary/10 border-primary/20' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="size-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t"
            >
              <div className="flex flex-wrap gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium flex items-center gap-1">
                    <Tag className="size-3" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-[400px]">
                    {uniqueTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        className="cursor-pointer text-xs"
                        onClick={() =>
                          setSelectedTag(selectedTag === tag ? null : tag)
                        }
                      >
                        {tag}
                        {selectedTag === tag && (
                          <X
                            className="ml-1 size-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(null);
                            }}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator orientation="vertical" className="h-auto" />

                <div className="space-y-1">
                  <div className="text-xs font-medium flex items-center gap-1">
                    <Users className="size-3" /> Authors
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-[400px]">
                    {uniqueAuthors.map((author) => (
                      <Badge
                        key={author}
                        variant={
                          selectedAuthor === author ? 'default' : 'outline'
                        }
                        className="cursor-pointer text-xs"
                        onClick={() =>
                          setSelectedAuthor(
                            selectedAuthor === author ? null : author,
                          )
                        }
                      >
                        {author}
                        {selectedAuthor === author && (
                          <X
                            className="ml-1 size-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAuthor(null);
                            }}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-between items-center mb-3">
          <p className="text-sm">
            {filteredAgents.length} agent
            {filteredAgents.length !== 1 ? 's' : ''} available
          </p>
          <p className="text-sm font-medium">{selectedCount} selected</p>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
          <AnimatePresence>
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => {
                const isBeingAdded = activeServer
                  ? agentsToAdd.includes(agent.id)
                  : undefined;
                const isBeingRemoved = activeServer
                  ? agentsToRemove.includes(agent.id)
                  : undefined;

                return (
                  <AgentListItem
                    key={agent.id}
                    agent={agent}
                    isSelected={isAgentSelected(agent.id)}
                    onSelect={() => toggleAgentSelection(agent.id)}
                    onShowDetails={() => setDetailAgent(agent)}
                    willBeAdded={isBeingAdded}
                    willBeRemoved={isBeingRemoved}
                  />
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 px-4 bg-muted/30 rounded-lg"
              >
                <div className="mx-auto size-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <Search className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-medium mb-1">No agents found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
                {(searchQuery || selectedTag || selectedAuthor) && (
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(null);
                      setSelectedAuthor(null);
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {detailAgent && (
            <AgentDetailModal
              agent={detailAgent}
              onClose={() => setDetailAgent(null)}
              onSelect={toggleAgentSelection}
              isSelected={isAgentSelected(detailAgent.id)}
              willBeAdded={
                activeServer ? agentsToAdd.includes(detailAgent.id) : undefined
              }
              willBeRemoved={
                activeServer
                  ? agentsToRemove.includes(detailAgent.id)
                  : undefined
              }
            />
          )}
        </AnimatePresence>
      </CardContent>

      {selectedCount > 0 && (
        <CardFooter className="p-4 border-t flex justify-between items-center bg-muted/30">
          <div className="text-sm">
            <span className="font-medium">{selectedCount}</span> agent
            {selectedCount !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedAgents.forEach((id) => {
                  if (isAgentSelected(id)) {
                    toggleAgentSelection(id);
                  }
                });
              }}
            >
              Clear Selection
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
