import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts = {}) => {
  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    
    // Create key combination string
    const modifiers = [];
    if (ctrlKey || metaKey) modifiers.push('ctrl');
    if (shiftKey) modifiers.push('shift');
    if (altKey) modifiers.push('alt');
    
    const combination = [...modifiers, key.toLowerCase()].join('+');
    
    // Check if this combination has a handler
    if (shortcuts[combination]) {
      event.preventDefault();
      shortcuts[combination]();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// Common keyboard shortcuts for chat
export const useChatKeyboardShortcuts = ({
  onNewSession,
  onClearChat,
  onToggleSidebar,
  onFocusInput,
}) => {
  const shortcuts = {
    'ctrl+n': onNewSession,           // New session
    'ctrl+shift+delete': onClearChat, // Clear chat  
    'ctrl+b': onToggleSidebar,        // Toggle sidebar
    'ctrl+l': onFocusInput,           // Focus input
    '/': onFocusInput,                // Quick focus (like Discord)
  };

  useKeyboardShortcuts(shortcuts);
};
