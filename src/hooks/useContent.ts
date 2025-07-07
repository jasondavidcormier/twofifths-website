import { useState, useEffect } from 'react';
import { contentManager, ContentData } from '../utils/contentManager';

export const useContent = () => {
  const [content, setContent] = useState<ContentData>(contentManager.getContent());

  useEffect(() => {
    const unsubscribe = contentManager.subscribe(setContent);
    return unsubscribe;
  }, []);

  return content;
};