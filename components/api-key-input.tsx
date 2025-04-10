"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProvisioner } from '@/lib/provisioner-context';
import { setApiKey as saveApiKey, getApiKey } from '@/lib/utils';
import { toast } from 'sonner';
import { Eye, EyeOff, Trash } from 'lucide-react';
import Link from 'next/link';

export function ApiKeyInput() {
  const { apiKey, setApiKey, refreshServerStatus } = useProvisioner();
  const [inputValue, setInputValue] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Load API key from local storage on mount
  useEffect(() => {
    const storedApiKey = getApiKey();
    setInputValue(storedApiKey);
  }, []);

  // Update input value when apiKey in context changes
  useEffect(() => {
    setInputValue(apiKey);
  }, [apiKey]);

  // Auto-save API key when input changes
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

  const handleClear = () => {
    setInputValue('');
    saveApiKey('');
    setApiKey('');
    toast.success('API key cleared');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 1: API Key</CardTitle>
        <CardDescription>
          Enter your Heurist API key to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="apiKey">Step 1. Input your Heurist API key</Label>
            <div className="flex">
              <Input
                id="apiKey"
                placeholder="Enter your Heurist API key"
                type={showApiKey ? 'text' : 'password'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button
                className={buttonVariants({ variant: "outline", size: "icon", className: "ml-2" })}
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mt-2 space-y-1">
              <div>
                <Link href="https://dev-api-form.heurist.ai/" target="_blank" className="text-primary hover:underline">
                  Apply for a free API key
                </Link>
              </div>
              <div>
                <Link href="https://www.heurist.ai/credits" target="_blank" className="text-primary hover:underline">
                  Top up credits with crypto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          className={buttonVariants({ variant: "default" })}
          onClick={() => {
            // Scroll to agent selection section
            document.getElementById('agent-selection')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
