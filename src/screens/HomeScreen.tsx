import React, { useEffect, useState } from "react";
import { View, Button, Image, Text, ScrollView, Alert } from "react-native";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { DataInputType, getText } from 'rn-ocr-lib'
import useAnalyzeService from "../services/analyzeSerivce"; // DEBUG: {useAnalyzeService} -> useAnalyzeService. default export 방식은 이렇게 해야함.
import { useImagePicker } from "../hooks/useImagePicker";
import { saveParseResult } from "../services/databaseService";


export default function HomeScreen() {
    const [processedText, setProcessedText] = useState('');
    const { imageUri, base64Data, pickImage } = useImagePicker();
    const { analyzeImage, analysisResult, isAnalyzing, parseResult } = useAnalyzeService();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 100 }}>
            <Button title="이미지 선택" onPress={pickImage} />

            {base64Data && (
                <View style={{ marginTop: 20 }}>
                    <Button
                        title={isAnalyzing ? "분석 중..." : "LLM으로 이미지 분석"}
                        onPress={() => analyzeImage(base64Data)}
                        disabled={isAnalyzing}
                    />
                </View>
            )}

            {imageUri && (
                <View style={{ marginTop: 20 }}>
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: 300, height: 300, marginTop: 10 }}
                        resizeMode="contain"
                    />
                </View>
            )}

            <View style={{ marginTop: 20 }}>
                <Text>LLM 분석 결과:</Text>
                <View>
                    <Text>테스트 이름: {parseResult?.test?.test_name}</Text>
                    {parseResult?.problems?.map((problem, idx) => (
                        <View key={idx}>
                            <Text>문제 번호: {problem.number}</Text>
                            <Text>유형: {problem.type}</Text>
                            <Text>내용: {problem.content}</Text>
                            <Text>도형: {problem.figure ?? '없음'}</Text>
                            <Text>선택지: {problem.options ?? '없음'}</Text>
                            <Text>정답: {problem.correct_answer} </Text>
                            <Text>선택: {problem.selected_answer ?? '없음'} </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View>
                <Button
                    title={'시험 저장하기'}
                    onPress={() => {
                        if (parseResult) {
                            saveParseResult(parseResult);
                        } else {
                            Alert.alert('분석 결과가 없습니다.');
                        }
                    }}
                    disabled={!parseResult}
                />
            </View>
        </ScrollView>
    );
}

