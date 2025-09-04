import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllTests } from '../services/databaseService';

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const [tests, setTests] = useState<Array<{ test_id: number; test_name: string; total_problems: number; correct_problems: number }>>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAllTests();
      setTests(data);
    };
    const unsubscribe = navigation.addListener('focus', load);
    load();
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: { test_id: number; test_name: string; total_problems: number; correct_problems: number } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Review', { testId: item.test_id, testName: item.test_name })}
    >
      <Text style={styles.cardTitle} numberOfLines={2}>{item.test_name}</Text>
      <Text style={styles.cardSub}>{item.correct_problems}/{item.total_problems}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {tests.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>저장된 시험이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={tests}
          keyExtractor={(it) => String(it.test_id)}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: '#666'
  },
  card: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    padding: 12,
    borderRadius: 12,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center'
  },
  cardSub: {
    marginTop: 6,
    fontSize: 12,
    color: '#555'
  }
});
