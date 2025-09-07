import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getProblemsByTestId } from '../services/databaseService';

const equalsIgnoringWhitespace = (a?: string | null, b?: string | null) => {
  const normalize = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, '');
  return normalize(a) === normalize(b);
};


export default function ReviewPage() {
  const route = useRoute<RouteProp<Record<string, { testId: number; testName?: string }>, string>>();
  const { testId, testName } = route.params ?? { testId: 0 };
  const [problems, setProblems] = useState<any[]>([]);
  const [isIncorrectAnswerMode, setIsIncorrectAnswerMode] = useState<Boolean>();
  const navigation = useNavigation<any>();
  
  const toggleIncorrectMode = () => {
    setIsIncorrectAnswerMode(!isIncorrectAnswerMode)
  }

  useEffect(() => {
    const load = async () => {
      if (!testId) return;
      const data = await getProblemsByTestId(testId);
      setProblems(data);
    };
    load();
  }, [testId]); // testId 변경 시 쿼리 재실행



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{testName ?? 'Review'}</Text>
      <Text style={styles.summary}>총 문제 개수: {problems.length}, 맞춘 문제 개수: {problems.filter((p) => equalsIgnoringWhitespace(p.correct_answer, p.selected_answer)).length}</Text>
      {(
        isIncorrectAnswerMode ?  
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleIncorrectMode}
        >
          <Text style={styles.buttonText}>전체 문제 보기</Text>
        </TouchableOpacity> :
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleIncorrectMode}
        >
          <Text style={styles.buttonText}>오답노트 모드</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={isIncorrectAnswerMode 
          ? problems.filter(item => !equalsIgnoringWhitespace(item.correct_answer, item.selected_answer))
          : problems
        }
        keyExtractor={(it) => String(it.problem_id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitle}>{item.number}. {item.content}</Text>
              <Text style={styles.itemMeta}>정답: {item.correct_answer ?? '-'} | 선택: {item.selected_answer ?? '-'}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Chat', { problemId: item.problem_id })} // DEBUG: 그냥 컴마 찍고 넘기면 안 되고 키 벨류 값으로 넘겨줘야 함.
                accessibilityRole="button"
                accessibilityLabel="채팅 열기"
                style={{ marginTop: 8, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, backgroundColor: '#e8f0fe' }}
              >
                <Text style={{ fontSize: 16 }}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', padding: 16 },
  summary: { paddingHorizontal: 16 },
  item: { backgroundColor: '#f7f7f7', padding: 12, borderRadius: 8 },
  itemTitle: { fontSize: 14, fontWeight: '600' },
  itemMeta: { marginTop: 4, color: '#666', fontSize: 12 },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
}); 