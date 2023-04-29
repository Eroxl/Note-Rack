import React, { useEffect, useState, useRef } from 'react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session'; 

import type { PagePath } from './pageInfo/PagePath';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant',
  content: string,
}

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const session = useSessionContext();
  const isLoggedIn = session?.loading === false && session?.doesSessionExist === true;

  // ~ Ask the question to the bot
  const askQuestion = async (chatMessages: ChatMessage[], newMessage: string): Promise<ChatMessage[]> => {
    const questionRequestParameters = `message=${newMessage}&previousMessages=${JSON.stringify(chatMessages)}&pageID=642677f04de15b4602121eb2`
    const questionRequestURI = `${process.env.NEXT_PUBLIC_API_URL}/account/chat?${questionRequestParameters}`;

    const questionRequest = await fetch(questionRequestURI, {
      method: 'GET',
      credentials: 'include',
    });

    const questionResponse = await questionRequest.json();

    return questionResponse.messages as ChatMessage[];
  }

  useEffect(() => {
    if (!isLoggedIn) return;

    const pagePaths: PagePath[] = [{
      icon: '🧠',
      name: 'Chat',
      pageID: 'chat',
    }]

    document.dispatchEvent(
      new CustomEvent(
        'pagePath',
        {
          detail: pagePaths,
        },
      ),
    )
  }, [isLoggedIn])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages, chatRef]);

  // ~ Fetch chat messages from local storage
  useEffect(() => {
    const chatMessages = localStorage.getItem('chatMessages');

    if (chatMessages) {
      setChatMessages(JSON.parse(chatMessages));
    }
  }, []);

  return (
    <div className="w-full h-full mt-10 overflow-y-auto pl-52 overflow-x-clip">
      <div className="relative w-full h-screen max-w-4xl px-20 mx-auto">
        <div
          className="flex flex-col w-full h-[calc(100%-8rem)] mx-auto overflow-scroll no-scrollbar"
          ref={chatRef}
        >
          {
            chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-row gap-2 py-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex flex-col gap-1 px-3 py-2 rounded-lg ${message.role === 'user' ? 'bg-sky-300 text-zinc-700' : 'bg-amber-50 text-zinc-700'}`}
                >
                  <p className="text-sm font-medium whitespace-pre-line">
                    {
                      message.role === 'user'
                        ? 'You'
                        : 'Bot'
                    }
                  </p>
                  <p className="text-sm whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="absolute w-full max-w-4xl px-20 mx-auto translate-x-1/2 -translate-y-full bottom-5 right-1/2">
          <input
            className="relative w-full p-2 overflow-scroll text-white break-normal rounded max-h-12 bg-white/10 focus:outline-none"
            placeholder="Ask a question..."
            type="text"
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;

              (async () => {
                const input = e.target as HTMLInputElement;
                const value = input.value;

                input.value = '';

                setChatMessages([
                  ...chatMessages,
                  {
                    role: 'user',
                    content: value,
                  },
                  {
                    role: 'assistant',
                    content: '...',
                  }
                ])

                const newChatMessages = await askQuestion(chatMessages, value);

                setChatMessages(newChatMessages);

                localStorage.setItem('chatMessages', JSON.stringify(newChatMessages));
              })();
            }}
          />
        </div>
      </div>
    </div>
  )
};

export default Chat;
