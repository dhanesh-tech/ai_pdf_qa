
import React, { useState } from "react";
import { apiService } from "../utils/apiService";
import { apiUrls } from "../constants/apiUrls";

/**
 * Interface representing a chat message
 * @interface Message
 * @property {number} [page] - Optional page number reference for PDF documents
 * @property {string} text - The message content
 * @property {boolean} isUser - Whether the message is from the user (true) or AI (false)
 */
interface Message {
  page?: number;
  text: string;
  isUser: boolean;
}


function useChatInterface() {

  /** State for storing chat messages */
  const [messages, setMessages] = useState<Message[]>([]);
  /** State for the current input message */
  const [inputMessage, setInputMessage] = useState("");
  /** State for tracking message sending status */
  const [sendMessageLoading, setSendMessageLoading] = useState(false);

  /**
   * Handles sending a message when the send button is clicked or Enter is pressed
   * 
   * Validates that the input message is not empty, adds it to the messages array,
   * clears the input field, and sends the message to the backend for processing.
   * 
   * @function handleSendMessage
   * @returns {void}
   */
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

  /**
   * Handles keyboard events for the input field
   * 
   * Sends the message when Enter is pressed (without Shift key for new lines)
   * 
   * @function handleKeyPress
   * @param {React.KeyboardEvent} e - The keyboard event object
   * @returns {void}
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Sends a message to the backend API and handles the response
   * 
   * Makes an API call to process the user's message and get an AI response.
   * Updates the messages state with the AI response, including any page references
   * for PDF documents.
   * 
   * @async
   * @function sendMessageToBackend
   * @param {string} message - The message to send to the backend
   * @returns {Promise<void>}
   */
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
  return {
    messages,
    inputMessage,
    sendMessageLoading,
    handleSendMessage,
    handleKeyPress,
    sendMessageToBackend,
    setInputMessage,
  }
}

export default useChatInterface