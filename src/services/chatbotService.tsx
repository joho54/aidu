import { useState } from 'react';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// 커스텀 훅
export const useChatbotService = () => {
    // 메시지 상태
    const [messages, setMessages] = useState<Message[]>([]);
    // 로딩 상태
    const [loading, setLoading] = useState(false);
    // 에러 상태
    const [error, setError] = useState<string | null>(null);

    // 메시지 전송 함수
    const sendMessage = async (userMessage: string) => {
        // 상태 관리
        setLoading(true);
        setError(null);
        try {
            // 인자값으로 넘어온 메시지를 updatedMessages에 추가
            const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
            // message state 설정
            setMessages(updatedMessages);
            console.log(updatedMessages)

            // 응답 받기. updated message로 전송. 
            // 백엔드 서버로 목적지 교체 -> 기존 분석 함수를 참조해서 구현해보기.
            const response = await fetch('http://localhost:8000/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                }),
            });

            // json 형식으로 변환.
            const data = await response.json();
            const assistantReply = data?.message ?? '';
            // 응답을 포함해서 메시지 배열 갱신
            setMessages((prev) => [...prev, { role: 'assistant', content: assistantReply }]);
        } catch (err) {
            setError('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return { messages, sendMessage, loading, error };
};
