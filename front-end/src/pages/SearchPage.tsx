
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';

const ChatPage = () => {
  const [messages, setMessages] = useState<Array<{id: string, content: string, sender: 'user' | 'bot'}>>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!inputMessage.trim()) return;
    
  //   // Add user message
  //   const userMessageId = Date.now().toString();
  //   const userMessage = {
  //     id: userMessageId,
  //     content: inputMessage,
  //     sender: 'user' as const
  //   };
    
  //   setMessages(prev => [...prev, userMessage]);
  //   setInputMessage('');
  //   setIsLoading(true);
    
  //   // Simulate bot response after a delay
  //   setTimeout(() => {
  //     const botResponse = {
  //       id: (Date.now() + 1).toString(),
  //       content: `I received your message: "${inputMessage}". This is a simulated response as I'm currently operating without a real ML backend.`,
  //       sender: 'bot' as const
  //     };
  //     setMessages(prev => [...prev, botResponse]);
  //     setIsLoading(false);
  //   }, 1000);
  // };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!inputMessage.trim()) return;
  
    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      content: inputMessage,
      sender: 'user' as const
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
  
    const startTime = performance.now(); // Start timer
  
    try {
      const response = await fetch('http://127.0.0.1:8000/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: inputMessage })
      });
  
      const endTime = new Date().getTime();
      const durationInSeconds = (endTime - startTime) / 1000;
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      const duration = `${minutes}m ${seconds}s`;
      
  
      if (!response.ok) {
        throw new Error('Failed to fetch from RAG endpoint');
      }
  
      const data = await response.json();
  
      const botResponse = {
        id: (Date.now() + 1).toString(),
        content: `${data.answer}\n\n⏱️ (Response time: ${duration} seconds)`,
        sender: 'bot' as const
      };
  
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('❌ Error fetching from backend:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, something went wrong while contacting the AI backend.',
        sender: 'bot' as const
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Chat Assistant</h1>
            <p className="text-gray-600 mt-2">
              Chat with our AI assistant to get help with your questions
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-white rounded-lg border p-4">
            {messages.map(message => (
              <ChatMessage 
                key={message.id} 
                content={message.content} 
                sender={message.sender} 
              />
            ))}
            {isLoading && (
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-blue-800 bg-blue-100">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 py-6"
            />
            <Button type="submit" disabled={!inputMessage.trim() || isLoading}>
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          Chat Assistant &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
