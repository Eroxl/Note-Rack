import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import Trash from '../public/icons/Trash.svg';
import Brain from '../public/icons/Brain.svg';
import { ReadableStreamDefaultReadResult } from 'stream/web';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant',
  content: string,
}

const Chat = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [shouldIntroBeShown, setShouldIntroBeShown] = useState(true);
  const [isChatDone, setIsChatDone] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  const { page } = useRouter().query;

  const renderChatMessage = (role: 'system' | 'user' | 'assistant', content: string) => {
    if (!chatRef.current) return;

    const chatMessageContainer = document.createElement('div');

    if (shouldIntroBeShown) {
      setShouldIntroBeShown(false);
    }

    chatMessageContainer.className = `flex flex-row gap-2 py-2 ${role === 'user' ? 'justify-end' : 'justify-start'}`;

    const chatMessage = document.createElement('div');

    chatMessage.className = `flex flex-col gap-1 px-3 py-2 rounded-lg ${role === 'user' ? 'bg-sky-300 text-zinc-700' : 'bg-amber-50 text-zinc-700'}`;

    const chatMessageRole = document.createElement('p');

    chatMessageRole.className = 'text-sm font-medium whitespace-pre-line';
    chatMessageRole.innerText = role === 'user' ? 'You' : 'Bot';

    const chatMessageContent = document.createElement('p');

    chatMessageContent.className = 'text-sm whitespace-pre-line';
    chatMessageContent.innerText = '';
    content.split('$').forEach((part, index) => {
      if (index % 2 === 0) {
        chatMessageContent.appendChild(document.createTextNode(part));
      } else {
        const html = katex.renderToString(part, {
          throwOnError: false,
        });

        const span = document.createElement('span');

        span.innerHTML = html;

        chatMessageContent.appendChild(span.firstChild!);
      }
    });

    chatMessage.appendChild(chatMessageRole);
    chatMessage.appendChild(chatMessageContent);
    chatMessageContainer.appendChild(chatMessage);

    chatRef.current.appendChild(chatMessageContainer);
  };

  // ~ Ask the question to the bot
  const askQuestion = async (chatMessages: ChatMessage[], newMessage: string) => {
    const questionRequestParameters = `message=${newMessage}&previousMessages=${JSON.stringify(chatMessages)}`
    const questionRequestURI = `${process.env.NEXT_PUBLIC_API_URL}/page/chat/${page}?${questionRequestParameters}`;

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
  }, [chatRef, page]);

  // ~ Fetch chat messages from local storage
  useEffect(() => {
    const unParsedChatMessages = localStorage.getItem('chatMessages');

    if (!unParsedChatMessages) return;

    const chatMessages: ChatMessage[] = JSON.parse(unParsedChatMessages);

    chatMessages.forEach((chatMessage) => {
      renderChatMessage(chatMessage.role, chatMessage.content);
    });
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

                      setShouldIntroBeShown(true);

                      if (chatRef.current) {
                        chatRef.current.innerHTML = '';
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        }
        {shouldIntroBeShown && (
          <div
            className="absolute flex flex-col justify-center w-full h-full px-20 text-center -translate-y-[56.5%] top-1/2"
          >
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
        <div
          className="flex flex-col w-full h-[calc(100%-8rem)] mx-auto overflow-scroll no-scrollbar px-20"
          ref={chatRef}
        />
        <div className="absolute flex flex-row w-full max-w-4xl gap-2 px-20 mx-auto translate-x-1/2 -translate-y-full bottom-5 right-1/2">
          <input
            className="relative flex-grow p-2 px-3 overflow-scroll text-white break-normal rounded-md max-h-12 bg-white/10 focus:outline-none"
            placeholder="Ask a question..."
            type="text"
            disabled={!isChatDone}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;

              setIsChatDone(false);

              (async () => {
                const input = e.target as HTMLInputElement;
                const value = input.value;

                input.value = '';

                renderChatMessage('user', value);
                const chatMessages: ChatMessage[] = JSON.parse(localStorage.getItem('chatMessages') || '[]');

                // ~ Add the user's message to the chat
                localStorage.setItem('chatMessages', JSON.stringify([
                  ...chatMessages,
                  {
                    role: 'user',
                    content: value,
                  },
                ]));
                
                renderChatMessage('assistant', '...');

                askQuestion(chatMessages, value).then((response) => {
                  const reader = response.body?.getReader();

                  let fullText = '';

                  const processText = async (result: ReadableStreamDefaultReadResult<Uint8Array>) => {
                    if (result.done) {
                      const newMessages: ChatMessage[] = [
                        ...chatMessages,
                        {
                          role: 'user',
                          content: value,
                        },
                        {
                          role: 'assistant',
                          content: fullText,
                        }
                      ];
                      
                      // setChatMessages(newMessages);
                      localStorage.setItem('chatMessages', JSON.stringify(newMessages));

                      setIsChatDone(true);

                      return;
                    }

                    const decoder = new TextDecoder('utf-8');

                    const chunk = decoder.decode(result.value, { stream: true });

                    // ~ Remove the most recent message
                    chatRef.current!.lastChild?.remove();

                    fullText += chunk;

                    renderChatMessage('assistant', fullText);
                    
                    chatRef.current!.scrollTo({
                      top: chatRef.current!.scrollHeight,
                      behavior: 'smooth',
                    });

                    reader?.read().then(processText as any);
                  };

                  reader?.read().then(processText as any);
                });
              })();
            }}
          />
          <button
            disabled={!isChatDone}
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
