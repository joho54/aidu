import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useChatbotService } from "../services/chatbotService";
import { getProblemById } from "../services/databaseService";
import { ProblemDTO } from "../DTO/ProblemDTO";
import { useRoute } from "@react-navigation/native";

export default function ChatScreen() {
    const { messages, sendMessage, loading, error } = useChatbotService();
    const [input, setInput] = useState("");
    const listRef = useRef<FlatList<any>>(null);
    const [question, setQuestion] = useState<ProblemDTO | null>(null); // DEBUG: 참조 스테이트들은 null 값을 허용해줘야 함.
    const { problemId } = useRoute().params as { problemId: number };
    const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

    const visibleMessages = useMemo(() => messages.filter(m => m.role !== 'system'), [messages]);

    const formInitialQuery = useCallback((q: any) => {
        // 데이터베이스에서 가져온 데이터를 ProblemDTO 형태로 변환
        const problem: ProblemDTO = {
            type: (q.type === 'essay' || q.type === 'multiple_choices') ? q.type : 'multiple_choices',
            number: q.number || 0,
            content: q.content || '',
            figure: q.figure,
            options: q.options,
            correct_answer: q.correct_answer,
            selected_answer: q.selected_answer
        };

        const query = `당신은 교육용 AI 튜터입니다. 학생이 문제를 풀고 답안을 제출했으니, 상세하고 도움이 되는 피드백을 제공해주세요.

**문제 정보:**
- 문제 유형: ${problem.type === 'essay' ? '서술형' : '객관식'}
- 문제 번호: ${problem.number}
- 문제 내용: ${problem.content}
${problem.figure ? `- 추가 자료: ${problem.figure}` : ''}
${problem.options ? `- 선택지: ${problem.options}` : ''}

**학생의 답안:**
${problem.selected_answer || '답안 없음'}

**정답:**
${problem.correct_answer || '정답 정보 없음'}

**피드백 요청사항:**
1. 문제의 핵심 개념과 해결 방법을 간단히 설명해주세요
2. 학생의 답안이 정답인지 확인하고, 틀렸다면 왜 틀렸는지 구체적으로 설명해주세요
3. 정답에 도달하는 과정을 단계별로 안내해주세요
4. 유사한 문제를 해결할 때 주의할 점이나 팁을 제공해주세요
5. 격려의 말씀도 포함해주세요

답변은 친근하고 이해하기 쉽게 작성해주세요.`;

        return query;
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getProblemById(problemId);
                const normalized = data?.[0];
                if (!mounted || normalized == null) return;
                setQuestion(normalized);
                const initialQuery = formInitialQuery(normalized);
                await sendMessage(initialQuery, 'system');
            } catch (e) {
                // noop
            }
        })();
        return () => {
            mounted = false;
        };
    }, [problemId]);

    const onPressSend = useCallback(async () => {
        const text = input.trim();
        if (!text) return;
        setInput("");
        await sendMessage(text, 'user');
        // 자동 스크롤
        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true });
        });
    }, [input, sendMessage]);

    const renderItem = useCallback(({ item }: { item: any }) => {
        const content: string = item?.content ?? "";
        const isUser = item?.role === "user";
        return (
            <View style={[styles.messageRow]}>
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.messageBubbleRight : styles.messageBubbleLeft
                ]}>
                    <Text style={styles.messageText}>{content}</Text>
                </View>
            </View>
        );
    }, []);

    const keyExtractor = useCallback((item: any, index: number) => String(index), []);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.listContainer}>
                <FlatList
                    ref={listRef}
                    data={visibleMessages}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
                />
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" />
                    </View>
                )}
                {!!error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
            </View>

            <View style={styles.inputBar}>
                <TextInput
                    style={styles.textInput}
                    value={input}
                    onChangeText={setInput}
                    placeholder="메시지를 입력하세요"
                    editable={!loading}
                    multiline
                />
                <TouchableOpacity onPress={onPressSend} disabled={!canSend} style={[styles.sendButton, !canSend && styles.sendButtonDisabled]} accessibilityRole="button" accessibilityLabel="메시지 보내기">
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>보내기</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    listContainer: { flex: 1 },
    listContent: { padding: 16, gap: 8 },
    messageRow: { flexDirection: "row" },
    messageBubble: { backgroundColor: "#f1f3f4", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, maxWidth: "90%" },
    messageText: { fontSize: 16, color: "#202124" },
    inputBar: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#e0e0e0", gap: 8 },
    textInput: { flex: 1, minHeight: 40, maxHeight: 120, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 8, fontSize: 16 },
    sendButton: { backgroundColor: "#1a73e8", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    sendButtonDisabled: { backgroundColor: "#a0c3ff" },
    sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    loadingOverlay: { position: "absolute", bottom: 56, alignSelf: "center", padding: 6, borderRadius: 8 },
    errorBox: { position: "absolute", bottom: 56, left: 16, right: 16, backgroundColor: "#fdecea", borderColor: "#f5c6cb", borderWidth: 1, padding: 8, borderRadius: 8 },
    errorText: { color: "#b71c1c" },
    // alignment variants
    messageBubbleLeft: { marginRight: "auto" },
    messageBubbleRight: { marginLeft: "auto", backgroundColor: "#d7ebff" },
});
