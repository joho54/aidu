import React, { useEffect, useState } from "react";
import { View, Image, Text, ScrollView, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { DataInputType, getText } from 'rn-ocr-lib'
import useAnalyzeService from "../services/analyzeSerivce";
import { useImagePicker } from "../hooks/useImagePicker";
import { saveParseResult } from "../services/databaseService";
import Problem from "../components/Problem";
import ImagePicker from "../components/ImagePicker";
import Button from "../components/Button";

export default function HomeScreen() {
    const [processedText, setProcessedText] = useState('');
    const { imageUri, base64Data, pickImage } = useImagePicker();
    const { analyzeImage, analysisResult, isAnalyzing, parseResult } = useAnalyzeService();

    const handleImageSelected = (base64: string) => {
        // 이미지 선택 완료 시 자동으로 LLM 분석 시작
        analyzeImage(base64);
    };

    const handleSaveTest = () => {
        if (parseResult) {
            saveParseResult(parseResult);
            Alert.alert('성공', '시험이 저장되었습니다.');
        } else {
            Alert.alert('오류', '분석 결과가 없습니다.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Aidu</Text>
            </View>

            {!imageUri ? (
                <View style={styles.imagePickerContainer}>
                    <ImagePicker onPress={() => pickImage(handleImageSelected)} />
                </View>
            ) : (

                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => pickImage(handleImageSelected)}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        {isAnalyzing && (
                            <View style={styles.analyzingOverlay}>
                                <Text style={styles.analyzingText}>분석 중...</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {parseResult && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>
                        {parseResult.test.test_name}
                    </Text>

                    {parseResult.problems.map((problem, idx) => (
                        <Problem key={idx} problem={problem} />
                    ))}
                </View>
            )}

            {parseResult && (
                <View style={styles.saveButtonContainer}>
                    <Button
                        title="시험 저장하기"
                        onPress={handleSaveTest}
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F5F5',
        paddingBottom: 20,
    },
    header: {
        backgroundColor: '#007AFF',
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    imagePickerContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
        position: 'relative',
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    analyzingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    analyzingText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultsContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    resultsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    saveButtonContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
});
