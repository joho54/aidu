import React, { useEffect, useState } from "react";
import { View, Button, Image, Text, ScrollView, Alert } from "react-native";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { DataInputType, getText } from 'rn-ocr-lib'
import useAnalyzeService  from "../services/analyzeSerivce"; // DEBUG: {useAnalyzeService} -> useAnalyzeService. default export 방식은 이렇게 해야함.
import { useImagePicker } from "../hooks/useImagePicker";

export default function HomeScreen() {
    const [processedText, setProcessedText] = useState('');
    
    
    const { imageUri, base64Data, pickImage } = useImagePicker();

    const {analyzeImage, analysisResult, isAnalyzing} = useAnalyzeService();

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
                   {/*  <Text>선택된 이미지 URI:</Text>
                    <Text selectable>{imageUri}</Text> */}
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: 300, height: 300, marginTop: 10 }}
                        resizeMode="contain"
                    />
                </View>
            )}

{/*             {base64Data && (
                <View style={{ marginTop: 20 }}>
                    <Text>base64 인코딩 데이터 (일부):</Text>
                    <Text selectable numberOfLines={4}>
                        {base64Data.substring(0, 100) + "..."}
                    </Text>
                </View>
            )} */}

            <View style={{ marginTop: 20 }}>
                <Text>LLM 분석 결과:</Text>
                <Text>{analysisResult || '분석 결과 없음'}</Text>
            </View>
        </ScrollView>
    );
}

