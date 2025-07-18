import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import VoiceInterface from './VoiceInterface';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  conversationId: string;
  onUpdateConversation: (id: string, title: string, messages: Message[]) => void;
  sidebarOpen: boolean;
  sidebarWidth: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId, onUpdateConversation, sidebarOpen, sidebarWidth }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there, sports fan! 🏆 I'm your AI sports companion. Whether you want to talk about the latest games, analyze player stats, discuss trade rumors, or dive deep into sports strategy, I'm here for it all. What's on your mind today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue;
    if (!content.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Check if the message contains "nutrition" to route to recipe chatbot
      const isNutritionQuery = content.toLowerCase().includes('nutrition');
      console.log('🔍 Detected nutrition query:', isNutritionQuery);
      
      const endpoint = isNutritionQuery ? '/recipe-chat' : '/chat';
      console.log('📡 Sending request to endpoint:', endpoint);
      
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });
      
      const data = await res.json();
      console.log('📥 Received response:', data);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, something went wrong.',
        sender: 'bot',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      // Update conversation in sidebar
      const title = userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : '');
      onUpdateConversation(conversationId, title, updatedMessages);
    } catch (error) {
      console.error('❌ Error in chat request:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed Chat Header */}
      <div
        className="fixed top-14 z-10 border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 transition-all duration-500"
        style={{
          left: sidebarOpen ? sidebarWidth : 0,
          right: 0,
          transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'left',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Sports Talk AI</h2>
            <p className="text-sm text-muted-foreground">Your intelligent sports discussion companion</p>
          </div>
        </div>
      </div>

      {/* Messages Area with top padding to account for fixed header */}
      <div className="flex-1 pt-20 pb-20">
        <ScrollArea className="h-full px-4">
          <div className="max-w-4xl mx-auto py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 mb-6 ${message.sender === 'user' ? 'justify-end' : ''}`}
              >
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-card text-card-foreground'
                  } rounded-2xl px-4 py-3 shadow-sm`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User size={16} className="text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-primary-foreground" />
                </div>
                <div className="bg-card rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Fixed Input Area */}
      <div
        className="fixed bottom-0 z-10 border-t border-border bg-card/50 backdrop-blur-sm p-4 transition-all duration-500"
        style={{
          left: sidebarOpen ? sidebarWidth : 0,
          right: 0,
          transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1)',
          willChange: 'left',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about sports, players, games, stats, or nutrition..."
                className="min-h-[48px] resize-none bg-background border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>
            <VoiceInterface onSendMessage={handleSendMessage} />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
