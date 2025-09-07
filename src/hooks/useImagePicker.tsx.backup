import { useState } from 'react';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

export const useImagePicker = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('사용자가 이미지 선택을 취소했습니다.');
        } else if (response.errorCode) {
          console.error('이미지 선택 에러:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset: Asset = response.assets[0];
          setImageUri(asset.uri ?? null);
          setBase64Data(asset.base64 ?? null);
        }
      }
    );
  };

  return { imageUri, base64Data, pickImage };
};
