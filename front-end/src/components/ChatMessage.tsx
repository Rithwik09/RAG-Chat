
import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'bot';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={cn(
      "flex items-start gap-3 max-w-[85%]",
      isUser ? "ml-auto" : "mr-auto"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-blue-100 order-last" : "bg-green-100"
      )}>
        {isUser ? <User size={16} className="text-blue-600" /> : <Bot size={16} className="text-green-600" />}
      </div>
      
      <div className={cn(
        "rounded-lg py-2 px-3",
        isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
      )}>
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
