import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useChatbotService } from "../services/chatbotService";

export default function ChatScreen() {
    const { messages, sendMessage, loading, error } = useChatbotService();
    const [input, setInput] = useState("");
    const listRef = useRef<FlatList<any>>(null);

    const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

    const onPressSend = useCallback(async () => {
        const text = input.trim();
        if (!text) return;
        setInput("");
        await sendMessage(text);
        // 자동 스크롤
        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true });
        });
    }, [input, sendMessage]);

    const renderItem = useCallback(({ item }: { item: any }) => {
        const content: string = item?.content ?? "";
        return (
            <View style={styles.messageRow}>
                <View style={styles.messageBubble}>
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
                    data={messages}
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
});
