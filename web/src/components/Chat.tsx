import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import Trash from '../public/icons/Trash.svg';
import Brain from '../public/icons/Brain.svg';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant',
  content: string,
}

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const mostRecentMessageRef = useRef<HTMLDivElement>(null);

  // ~ Ask the question to the bot
  const askQuestion = async (chatMessages: ChatMessage[], newMessage: string) => {
    const questionRequestParameters = `message=${newMessage}&previousMessages=${JSON.stringify(chatMessages)}&pageID=644d80d371788657e59633ca`
    const questionRequestURI = `${process.env.NEXT_PUBLIC_API_URL}/account/chat?${questionRequestParameters}`;

    const questionRequest = fetch(questionRequestURI, {
      method: 'GET',
      credentials: 'include',
    });

    return questionRequest;
  }

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
    <div className="w-full h-full mt-10 overflow-y-auto overflow-x-clip">
      <div className="relative w-full h-screen max-w-4xl mx-auto">
        {
          isDeleteModalOpen && (
            <div
              className="absolute z-10 flex flex-col items-center justify-center w-full h-full bg-black/30"
              onClick={() => {
                setIsDeleteModalOpen(false);
              }}
            >
              <div
                className="absolute flex flex-col items-center justify-center p-8 -translate-y-2/3 bg-zinc-700 rounded-xl top-1/2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <p className="text-2xl font-bold text-center text-amber-50">
                  Delete chat history
                </p>
                <p className="text-lg text-center text-amber-50">
                  Are you sure you want to delete
                  <br />
                  your chat history?
                </p>
                <div className="flex flex-row w-full gap-2 mt-5">
                  <button
                    className="flex items-center justify-center w-full p-2 text-xl font-bold bg-blue-400 rounded-md text-amber-50"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex items-center justify-center w-full p-2 text-xl font-bold bg-red-400 rounded-md text-amber-50"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      localStorage.removeItem('chatMessages');
                      setChatMessages([]);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        }
        <div
          className="flex flex-col w-full h-[calc(100%-8rem)] mx-auto overflow-scroll no-scrollbar px-20"
          ref={chatRef}
        >
          {chatMessages.length === 0 && (
            <div className="flex flex-col justify-center w-full h-full text-center">
              <p className="flex items-center justify-center pb-3 text-2xl font-bold text-amber-50">
                <Image
                  src={Brain}
                  alt="Brain"
                  width={50}
                  height={50}
                />
                Chat
              </p>
              <p className="text-xl font-medium text-amber-50">
                Ask a question to get started
              </p>
              <p className="text-amber-50">
                Note Rack chat allows you to ask questions about the page you are on,
                and get answers from an interactive assistant.
              </p>
            </div>
          )}
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
                  <p 
                    className="text-sm whitespace-pre-line"
                    ref={index === chatMessages.length - 1 ? mostRecentMessageRef : null}
                  >
                    {
                      (() => {
                        if (index === chatMessages.length - 1 && message.content.match(/\$.*\$/) && mostRecentMessageRef.current) {
                          mostRecentMessageRef.current.innerText = '';
                        }

                        return (
                          message.content.split('$').map((part, index) => {
                            if (index % 2 === 0) {
                              return part;
                            } else {
                              return (
                                <span
                                  dangerouslySetInnerHTML={{ __html: (
                                    katex.renderToString(part, {
                                      throwOnError: false,
                                    })
                                  )}}
                                />
                              )
                            }
                          })
                        )
                      })()
                    }
                  </p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="absolute flex flex-row w-full max-w-4xl gap-2 px-20 mx-auto translate-x-1/2 -translate-y-full bottom-5 right-1/2">
          <input
            className="relative flex-grow p-2 px-3 overflow-scroll text-white break-normal rounded-md max-h-12 bg-white/10 focus:outline-none"
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

                askQuestion(chatMessages, value).then((response) => {
                  const reader = response.body?.getReader();

                  if (!mostRecentMessageRef.current) return;

                  const processText = async (result: ReadableStreamReadResult<Uint8Array>) => {
                    if (result.done) {
                      const newMessages: ChatMessage[] = [
                        ...chatMessages,
                        {
                          role: 'user',
                          content: value,
                        },
                        {
                          role: 'assistant',
                          content: mostRecentMessageRef.current!.innerText,
                        }
                      ];
                      
                      setChatMessages(newMessages);
                      localStorage.setItem('chatMessages', JSON.stringify(newMessages));

                      return;
                    }

                    const decoder = new TextDecoder('utf-8');

                    const chunk = decoder.decode(result.value, { stream: true });

                    if (mostRecentMessageRef.current!.innerText === '...') {
                      mostRecentMessageRef.current!.innerText = '';
                    }

                    mostRecentMessageRef.current!.innerText += chunk;
                    
                    chatRef.current!.scrollTo({
                      top: chatRef.current!.scrollHeight,
                      behavior: 'smooth',
                    });

                    reader?.read().then(processText);
                  };

                  reader?.read().then(processText);
                });
              })();
            }}
          />
          <button
            className="flex items-center justify-center w-12 h-12 bg-red-400 rounded-md"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Image
              src={Trash}
              alt="Trash"
              width={26}
              height={26}
            />
          </button>
        </div>
      </div>
    </div>
  )
};

export default Chat;
