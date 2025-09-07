import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ImagePickerProps {
  onPress: () => void;
}

export default function ImagePicker({ onPress }: ImagePickerProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.plusIcon}>
        <Text style={styles.plusText}>+</Text>
      </View>
      <Text style={styles.label}>이미지 선택</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginVertical: 20,
  },
  plusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  plusText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
