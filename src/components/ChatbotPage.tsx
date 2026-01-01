import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatbotService } from '../services/chatbotService';

interface ChatbotPageProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export default function ChatbotPage({ onNavigate }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your CareerDisha AI assistant powered by Google AI. I'm here to help you with career guidance, educational choices, and planning your future. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev: Message[]) => [...prev, userMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        // Check for quick responses first
        const quickResponse = chatbotService.getQuickResponse(inputText);
        let botResponseText: string;
        
        if (quickResponse) {
          botResponseText = quickResponse;
        } else {
          // Use Google AI for more complex queries
          botResponseText = await chatbotService.sendMessage(inputText);
        }

        const botResponse: Message = {
          id: Date.now() + 1,
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages((prev: Message[]) => [...prev, botResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse: Message = {
          id: Date.now() + 1,
          text: "I apologize, but I'm experiencing some technical difficulties. Please try again or contact our support team for immediate assistance with your career questions.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev: Message[]) => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const quickSuggestions = [
    "What are the highest paying careers?",
    "Engineering vs Medical field",
    "Careers after 12th science",
    "Creative field opportunities"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-md mx-auto">
      {/* Chat Header */}
      <div className="px-4 py-4 border-b border-border bg-white">
        <div className="flex items-center space-x-3">
          <div className="bg-primary p-2 rounded-full">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">CareerDisha Assistant</h2>
            <p className="text-sm text-muted-foreground">Online • Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white border border-border rounded-bl-md'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {message.timestamp}
              </p>
            </div>
            <div className={`flex items-end mb-6 ${message.sender === 'user' ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
              {message.sender === 'bot' ? (
                <div className="bg-primary p-1.5 rounded-full">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="bg-muted p-1.5 rounded-full">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 py-2 border-t border-border bg-white">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputText(suggestion)}
              className="whitespace-nowrap rounded-full text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="px-4 py-4 border-t border-border bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me about careers..."
            className="flex-1 rounded-xl"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-primary hover:bg-primary/90 rounded-xl px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}