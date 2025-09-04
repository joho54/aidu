import { useState } from "react";
import { TestDTO } from "../DTO/TestDTO";
import { ProblemDTO } from "../DTO/ProblemDTO";
import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";
import { Alert } from "react-native";
import { ParseResultDTO } from "../DTO/ParseResultDTO";

export default function useAnalyzeService() {

  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResultDTO>();

  const parseAnalysisResult = (analysisResult: string): { test: TestDTO; problems: ProblemDTO[] } => {
    try {
      const lines = analysisResult
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      let test_name = '';
      const problems: ProblemDTO[] = [];
      let currentProblem: Partial<ProblemDTO> | null = null;

      const pushIfValid = () => {
        if (
          currentProblem &&
          currentProblem.type &&
          currentProblem.number !== undefined &&
          currentProblem.content
        ) {
          problems.push(currentProblem as ProblemDTO);
        }
        currentProblem = null;
      };

      for (const rawLine of lines) {
        const line = rawLine.startsWith('#') ? rawLine.slice(1).trim() : rawLine;
        const [rawKey, ...rest] = line.split(':');
        const key = rawKey.toLowerCase().trim();
        const value = rest.join(':').trim();

        if (key === 'test_name') {
          test_name = value;
          continue;
        }

        switch (key) {
          case 'type': {
            // New problem starts when we encounter a new type
            // Push previous if valid
            pushIfValid();
            if (value === 'essay' || value === 'multiple_choices') {
              currentProblem = { type: value };
            } else {
              currentProblem = {};
            }
            break;
          }
          case 'number': {
            if (!currentProblem) currentProblem = {};
            currentProblem.number = Number(value);
            break;
          }
          case 'content': {
            if (!currentProblem) currentProblem = {};
            currentProblem.content = value;
            break;
          }
          case 'figure': {
            if (!currentProblem) currentProblem = {};
            currentProblem.figure = value === '없음' || value === '' ? null : value;
            break;
          }
          case 'options': {
            if (!currentProblem) currentProblem = {};
            currentProblem.options = value === '없음' || value === '' ? null : value;
            break;
          }
          default:
            break;
        }
      }

      // Push the last accumulated problem if valid
      pushIfValid();

      return { test: { test_name }, problems };
    }
    catch {
      Alert.alert('Parse Failed')
      return { test: { test_name: '' }, problems: [] };
    }

  };

  const analyzeTest = async (base64Image: string): Promise<{ success: boolean; analysis?: string; parse_result?: any }> => {
    const prompt = `이 시험 문제를 분석해 주세요. 응답은 다음 형식으로 작성해 주세요:

#test_name: <전체 문제에 적합한 시험 이름>

각 문제마다 아래 항목을 포함해 주세요:
- #type: essay 또는 multiple_choices 중 하나
- #number: 문제 번호
- #content: 문제 내용
- #figure: 도형 또는 그림 설명 (없으면 "없음" 또는 비워도 됨)
- #options: 선택지가 있으면 선택지 목록, 없으면 "없음" 또는 비워도 됨

예시)
#test_name: 수학 기초 시험

#type: multiple_choices
#number: 1
#content: 이차방정식의 근을 구하시오.
#figure: 없음
#options: ① 1, ② -1, ③ 0, ④ 2, ⑤ -2

#type: essay
#number: 2
#content: 함수의 정의역과 치역을 설명하시오.
#figure: 없음
#options: 없음
`

    try {
      setIsAnalyzing(true);
      const response = await fetch('http://localhost:8000/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          base64_image: base64Image
        })
      });

      const data = await response.json();
      setAnalysisResult(data.analysis);
      const parse_result = parseAnalysisResult(data.analysis);
      setParseResult(parse_result);
      setIsAnalyzing(false);
      return {
        success: data.success,
        analysis: data.analysis,
        parse_result: parse_result
      };
    } catch (error) {
      setIsAnalyzing(false)
      console.error('API 호출 에러:', error);
      return { success: false };
    }
  };

  return {
    analyzeImage: analyzeTest,
    analysisResult,
    parseResult,
    isAnalyzing,
  }

}
