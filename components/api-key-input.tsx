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
import {
  setApiKey as saveApiKey,
  getApiKey,
  scrollToAgentSelection,
} from '@/lib/utils';
import { Eye, EyeOff, KeyRound, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const isValidApiKey = (key: string): boolean => {
  if (!key || key.trim().length < 8) return false;
  return key.includes('#') || key.includes('-');
};

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
    if (inputValue.trim() && inputValue !== apiKey) {
      const timer = setTimeout(async () => {
        try {
          if (isValidApiKey(inputValue)) {
            saveApiKey(inputValue);
            setApiKey(inputValue);
            await refreshServerStatus();
          }
        } catch (error) {
          console.error('Error refreshing server status:', error);
        } finally {
        }
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [inputValue, apiKey, setApiKey, refreshServerStatus]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-card/80 to-card">
      <Card className="w-full border-0 bg-transparent">
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

        <CardContent className="px-6 sm:px-8 pb-6">
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

              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:flex-1">
                  <Link
                    href="https://dev-api-form.heurist.ai/"
                    target="_blank"
                    className={buttonVariants({
                      variant: 'outline',
                      className:
                        'justify-start border-primary/20 bg-gradient-to-r from-background/80 to-background/40 backdrop-blur hover:bg-primary/10 h-14 text-sm shadow-sm transition-all hover:shadow w-full sm:w-auto',
                    })}
                  >
                    <div className="size-7 rounded-full bg-gradient-to-br from-[#cdf138]/40 to-[#cdf138]/20 flex items-center justify-center mr-2">
                      <span className="text-base">🔑</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Get Free API Key</span>
                      <span className="text-xs text-muted-foreground">
                        Quick registration
                      </span>
                    </div>
                    <ExternalLink className="ml-auto size-3 text-muted-foreground/70" />
                  </Link>

                  <Link
                    href="https://www.heurist.ai/credits"
                    target="_blank"
                    className={buttonVariants({
                      variant: 'outline',
                      className:
                        'justify-start border-primary/20 bg-gradient-to-r from-background/80 to-background/40 backdrop-blur hover:bg-primary/10 h-14 text-sm shadow-sm transition-all hover:shadow w-full sm:w-auto',
                    })}
                  >
                    <div className="size-7 rounded-full bg-gradient-to-br from-[#cdf138]/40 to-[#cdf138]/20 flex items-center justify-center mr-2">
                      <span className="text-base">💰</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Add More Credits</span>
                      <span className="text-xs text-muted-foreground">
                        Pay with crypto
                      </span>
                    </div>
                    <ExternalLink className="ml-auto size-3 text-muted-foreground/70" />
                  </Link>
                </div>

                <Button
                  className="rounded-full px-5 py-2 h-11 bg-[#cdf138] text-black hover:brightness-110 transition-all text-sm font-medium ml-auto mt-1.5 hidden sm:flex"
                  onClick={() => scrollToAgentSelection()}
                >
                  <span>Next</span>
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 sm:hidden">
          <Button
            className="rounded-full px-5 h-11 bg-[#cdf138] text-black hover:brightness-110 transition-all text-sm font-medium w-full"
            onClick={() => scrollToAgentSelection()}
          >
            <span>Next</span>
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
