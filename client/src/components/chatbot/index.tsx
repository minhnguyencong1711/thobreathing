import React from 'react';
import { ChatbotButton } from './ChatbotButton';
import { ChatbotPanel } from './ChatbotPanel';
import { useChatbot } from '../../hooks/useChatbot';
import { UserBurnoutContext } from '../../types/chatbot';

interface ChatbotWidgetProps {
  userContext?: UserBurnoutContext;
  expirationText?: string;
  remainingDays?: number;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  userContext,
  expirationText,
  remainingDays,
}) => {
  const {
    isOpen,
    messages,
    isTyping,
    rateLimitInfo,
    rateLimitBanner,
    unreadCount,
    toggleOpen,
    sendMessage,
    clearChat,
  } = useChatbot(userContext);

  return (
    <>
      <ChatbotButton
        isOpen={isOpen}
        unreadCount={unreadCount}
        onToggle={toggleOpen}
      />
      <ChatbotPanel
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        rateLimitInfo={rateLimitInfo}
        rateLimitBanner={rateLimitBanner}
        userContext={userContext}
        expirationText={expirationText}
        remainingDays={remainingDays}
        onClose={() => toggleOpen(false)}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
      />
    </>
  );
};

export default ChatbotWidget;
