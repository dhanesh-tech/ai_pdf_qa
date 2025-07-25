import React, { useState } from "react";
import { apiService } from "../utils/apiService";
import { apiUrls } from "../constants/apiUrls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Message {
  page?: number;
  text: string;
  isUser: boolean;
}

function ChatInterface({
  handlePageClick,
  onClearFile,
}: {
  handlePageClick: (page: number) => void;
  onClearFile: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        text: inputMessage,
        isUser: true,
      };
      setMessages([...messages, newMessage]);

      setInputMessage("");
      sendMessageToBackend(inputMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendMessageToBackend = async (message: string) => {
    setSendMessageLoading(true);
    const res = await apiService.postData(apiUrls.sendUserChat, {
      message,
      matchCount: 10,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        page: res.page,
        text: res.text,
        isUser: false,
      },
    ]);
    setSendMessageLoading(false);
  };
  console.log(" chat interface component");
  return (
    <div className="h-full border border-neutral-200 rounded-soft flex flex-col bg-white shadow-soft overflow-hidden relative">
      {/* Cross Button */}
      <button
        onClick={onClearFile}
        className="absolute top-4 right-3 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-red-50 hover:border-red-300 group"
        title="Clear file and return to upload"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      {messages.length === 0 && (
        <>
          {/* Enhanced Header */}
          <div className="p-8 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 text-white border-b border-primary-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/20 animate-pulse-glow">
                <div className="text-3xl">📄</div>
              </div>
              <div>
                <h1 className="text-3xl font-bold m-0 tracking-tight animate-slide-up">
                  Document Analysis Ready
                </h1>
                <p className="text-white/90 text-base mt-2 m-0 font-medium animate-slide-up animation-delay-1000">
                  Your document has been processed and is ready for AI-powered
                  analysis
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="flex-1 p-8 bg-gradient-to-br from-neutral-50 to-primary-50/30 overflow-y-auto">
            <div className="text-center mb-12 animate-slide-up animation-delay-2000">
              {/* Enhanced Example Questions */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center justify-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-bold">
                    💡
                  </span>
                  Start Your Analysis these example questions
                </h3>

                <div className="grid gap-4 max-w-3xl mx-auto">
                  {[
                    {
                      question: "Explain the methodology used in this document",
                      icon: "🔬",
                      category: "Analysis",
                    },
                    {
                      question: "What are the main recommendations?",
                      icon: "💡",
                      category: "Actions",
                    },
                    {
                      question:
                        "Can you extract the important dates and deadlines?",
                      icon: "📅",
                      category: "Timeline",
                    },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(item.question)}
                      className="group text-left p-4 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-white transition-all duration-300 text-sm text-neutral-700 hover:text-neutral-900 shadow-soft hover:shadow-medium hover-lift"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-primary-600 mb-1 uppercase tracking-wide">
                            {item.category}
                          </div>
                          <div className="font-medium leading-relaxed">
                            {item.question}
                          </div>
                        </div>
                        <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Messages Container */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.text}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-1 mt-1">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col">
                <div
                  className={`max-w-[75%] px-2 py-1 rounded-2xl ${
                    message.isUser
                      ? "bg-blue-400 text-white shadow-lg font-bold"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  } text-sm leading-relaxed`}
                >
                  {message.text}
                </div>
                {!message.isUser && message.page && (
                  <button
                    onClick={() => handlePageClick(message.page!)}
                    className="mt-2 self-start px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 border border-blue-200"
                  >
                    📄 Page {message.page}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="flex-shrink-0 p-4 border-t border-neutral-200 bg-white">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              disabled={sendMessageLoading}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className=" text-black text-md w-full px-4 py-3.5 border border-gray-400 rounded-xl bg-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 hover:shadow-md placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sendMessageLoading}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              inputMessage.trim()
                ? "bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            {sendMessageLoading ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
