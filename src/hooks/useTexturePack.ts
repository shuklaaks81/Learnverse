import { useState, useEffect } from 'react';

export type TexturePackImages = {
  button?: string;
  coin?: string;
  background?: string;
  card?: string;
  header?: string;
  achievement?: string;
  streak?: string;
  menu?: string;
};

export function useTexturePack() {
  const [isActive, setIsActive] = useState(false);
  const [textures, setTextures] = useState<TexturePackImages>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('texturePackActive') === 'true';
      setIsActive(active);

      if (active) {
        const savedTextures = localStorage.getItem('customTexturePackImages');
        if (savedTextures) {
          setTextures(JSON.parse(savedTextures));
        }
      }
    }
  }, []);

  const deactivate = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('texturePackActive', 'false');
      setIsActive(false);
    }
  };

  return { isActive, textures, deactivate };
}
