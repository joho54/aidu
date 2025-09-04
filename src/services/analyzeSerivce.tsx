export const analyzeImage = async (base64Image: string): Promise<{success: boolean; analysis?: any}> => {
    try {
      const response = await fetch('http://localhost:8000/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "이 문제 풀이 내용을 채점해주세요. 사용자의 응답이 무엇인지 정확하게 파악하고, 정답과 비교해주세요",
          base64_image: base64Image
        })
      });
  
      const data = await response.json();
      return {
        success: data.success,
        analysis: data.analysis,
      };
    } catch (error) {
      console.error('API 호출 에러:', error);
      return { success: false };
    }
  };
  