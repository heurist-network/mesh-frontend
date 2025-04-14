'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProvisioner } from '@/lib/provisioner-context';
import { setApiKey as saveApiKey, getApiKey } from '@/lib/utils';
import { Eye, EyeOff, KeyRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ApiKeyInput() {
  const { apiKey, setApiKey, refreshServerStatus } = useProvisioner();
  const [inputValue, setInputValue] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const storedApiKey = getApiKey();
    setInputValue(storedApiKey);
  }, []);

  useEffect(() => {
    setInputValue(apiKey);
  }, [apiKey]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.trim() && inputValue !== apiKey) {
        saveApiKey(inputValue);
        setApiKey(inputValue);
        try {
          await refreshServerStatus();
        } catch (error) {
          console.error('Error refreshing server status:', error);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, apiKey, setApiKey, refreshServerStatus]);

  const scrollToAgentSelection = () => {
    const agentSelectionSection = document.querySelector(
      '[data-agent-selection]',
    );
    if (agentSelectionSection) {
      agentSelectionSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card/80 to-card">
      <CardHeader className="p-6 sm:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="size-5 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Step 1. API Key
          </CardTitle>
        </div>
        <CardDescription className="text-base text-muted-foreground/90 pl-[52px]">
          Enter your Heurist API key to access the ecosystem
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 px-6 sm:px-8 pb-6">
        <div className="grid w-full items-center gap-6">
          <div className="flex flex-col space-y-4">
            <Label htmlFor="apiKey" className="text-base font-medium pl-1">
              Input your Heurist API key
            </Label>
            <div className="flex w-full">
              <Input
                id="apiKey"
                placeholder="Enter your Heurist API key"
                type={showApiKey ? 'text' : 'password'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-background/50 backdrop-blur border-primary/20 focus-visible:ring-primary/30 h-12 text-base"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
                className="ml-3 size-12 bg-background/50 backdrop-blur border-primary/20 hover:bg-primary/10"
              >
                {showApiKey ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <Link
                href="https://dev-api-form.heurist.ai/"
                target="_blank"
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'justify-start border-primary/20 bg-background/50 backdrop-blur hover:bg-primary/10 h-12 text-base',
                })}
              >
                <div className="size-7 rounded-full bg-[#cdf138]/20 flex items-center justify-center mr-3">
                  <span className="text-lg">🔑</span>
                </div>
                <span>Apply for a free API key</span>
              </Link>

              <Link
                href="https://www.heurist.ai/credits"
                target="_blank"
                className={buttonVariants({
                  variant: 'outline',
                  className:
                    'justify-start border-primary/20 bg-background/50 backdrop-blur hover:bg-primary/10 h-12 text-base',
                })}
              >
                <div className="size-7 rounded-full bg-[#cdf138]/20 flex items-center justify-center mr-3">
                  <span className="text-lg">💰</span>
                </div>
                <span>Top up credits with crypto</span>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pb-8 pt-2 px-6 sm:px-8">
        <Button
          className="rounded-full px-5 py-2 h-auto bg-[#cdf138] text-black hover:brightness-110 transition-all text-sm font-medium"
          onClick={scrollToAgentSelection}
        >
          <span>Next</span>
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
