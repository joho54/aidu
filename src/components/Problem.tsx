import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProblemDTO } from '../DTO/ProblemDTO';

interface ProblemProps {
  problem: ProblemDTO;
}

export default function Problem({ problem }: ProblemProps) {
  const isCorrect = problem.correct_answer === problem.selected_answer;
  const cardStyle = isCorrect ? styles.correctCard : styles.incorrectCard;

  return (
    <View style={[styles.card, cardStyle]}>
      <Text style={styles.problemNumber}>문제 {problem.number}</Text>
      <Text style={styles.problemType}>
        {problem.type === 'essay' ? '주관식' : '객관식'}
      </Text>
      
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{problem.content}</Text>
      </View>

      {problem.figure && (
        <View style={styles.figureContainer}>
          <Text style={styles.figureLabel}>추가 자료:</Text>
          <Text style={styles.figure}>{problem.figure}</Text>
        </View>
      )}

      {problem.options && (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsLabel}>선택지:</Text>
          <Text style={styles.options}>{problem.options}</Text>
        </View>
      )}

      <View style={styles.answerContainer}>
        <View style={styles.answerRow}>
          <Text style={styles.answerLabel}>정답:</Text>
          <Text style={styles.correctAnswer}>{problem.correct_answer}</Text>
        </View>
        
        <View style={styles.answerRow}>
          <Text style={styles.answerLabel}>선택:</Text>
          <Text style={styles.selectedAnswer}>
            {problem.selected_answer || '미선택'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  correctCard: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  incorrectCard: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  problemNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  problemType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  contentContainer: {
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  figureContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  figureLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  figure: {
    fontSize: 14,
    color: '#333',
  },
  optionsContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  options: {
    fontSize: 14,
    color: '#333',
  },
  answerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    width: 60,
  },
  correctAnswer: {
    fontSize: 14,
    color: '#4CAF50',
    flex: 1,
  },
  selectedAnswer: {
    fontSize: 14,
    color: '#F44336',
    flex: 1,
  },
});
