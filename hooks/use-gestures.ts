'use client';

import { useEffect, useRef, useState } from 'react';

interface GestureState {
  isPinching: boolean;
  initialDistance: number;
  currentScale: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  lastTouchTime: number;
  longPressTimer: number | null;
}

interface UseGesturesProps {
  onTap?: (x: number, y: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onLongPress?: (x: number, y: number) => void;
  onPinchZoom?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  minScale?: number;
  maxScale?: number;
  longPressDuration?: number;
}

export function useGestures({
  onTap,
  onDoubleTap,
  onLongPress,
  onPinchZoom,
  onPan,
  minScale = 0.5,
  maxScale = 3,
  longPressDuration = 500,
}: UseGesturesProps) {
  const [gestureState, setGestureState] = useState<GestureState>({
    isPinching: false,
    initialDistance: 0,
    currentScale: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    lastTouchTime: 0,
    longPressTimer: null,
  });

  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const lastPanPos = useRef<{ x: number; y: number } | null>(null);

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchPosition = (touch: React.Touch, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const touches = e.touches;

    // Clear any existing long press timer
    if (gestureState.longPressTimer) {
      clearTimeout(gestureState.longPressTimer);
    }

    if (touches.length === 2) {
      // Pinch gesture
      const distance = getDistance(touches[0], touches[1]);
      setGestureState(prev => ({
        ...prev,
        isPinching: true,
        initialDistance: distance,
        isDragging: false,
      }));
      e.preventDefault();
    } else if (touches.length === 1) {
      const pos = getTouchPosition(touches[0], target);
      touchStartPos.current = pos;
      lastPanPos.current = { x: touches[0].clientX, y: touches[0].clientY };

      // Start long press timer
      const timer = window.setTimeout(() => {
        if (touchStartPos.current && onLongPress) {
          onLongPress(pos.x, pos.y);
          touchStartPos.current = null; // Prevent tap/double-tap
        }
      }, longPressDuration);

      setGestureState(prev => ({
        ...prev,
        longPressTimer: timer,
        isDragging: false,
      }));
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const touches = e.touches;

    if (touches.length === 2 && gestureState.isPinching) {
      // Pinch zoom
      const distance = getDistance(touches[0], touches[1]);
      const scale = Math.max(
        minScale,
        Math.min(maxScale, gestureState.currentScale * (distance / gestureState.initialDistance))
      );
      
      if (onPinchZoom) {
        onPinchZoom(scale);
      }
      
      setGestureState(prev => ({
        ...prev,
        currentScale: scale,
        initialDistance: distance,
      }));
      e.preventDefault();
    } else if (touches.length === 1 && !gestureState.isPinching) {
      // Pan/Swipe
      if (lastPanPos.current) {
        const deltaX = touches[0].clientX - lastPanPos.current.x;
        const deltaY = touches[0].clientY - lastPanPos.current.y;
        
        // If moved more than 10px, consider it a drag (not a tap)
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > 10) {
          setGestureState(prev => ({ ...prev, isDragging: true }));
          
          // Clear long press timer on drag
          if (gestureState.longPressTimer) {
            clearTimeout(gestureState.longPressTimer);
          }
        }

        if (onPan) {
          onPan(deltaX, deltaY);
        }

        lastPanPos.current = { x: touches[0].clientX, y: touches[0].clientY };
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const now = Date.now();
    const timeSinceLastTouch = now - gestureState.lastTouchTime;

    // Clear long press timer
    if (gestureState.longPressTimer) {
      clearTimeout(gestureState.longPressTimer);
    }

    if (e.touches.length === 0) {
      // All fingers lifted
      if (!gestureState.isDragging && touchStartPos.current) {
        const touch = e.changedTouches[0];
        const pos = getTouchPosition(touch, target);

        // Check if position hasn't changed much (it's a tap)
        const dx = pos.x - touchStartPos.current.x;
        const dy = pos.y - touchStartPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) {
          // Double tap detection (within 300ms)
          if (timeSinceLastTouch < 300 && onDoubleTap) {
            onDoubleTap(pos.x, pos.y);
            setGestureState(prev => ({ ...prev, lastTouchTime: 0 })); // Reset to prevent triple tap
          } else if (onTap) {
            onTap(pos.x, pos.y);
            setGestureState(prev => ({ ...prev, lastTouchTime: now }));
          }
        }
      }

      setGestureState(prev => ({
        ...prev,
        isPinching: false,
        isDragging: false,
        longPressTimer: null,
      }));

      touchStartPos.current = null;
      lastPanPos.current = null;
    }
  };

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    gestureState,
  };
}

// Higher-level hook for canvas gestures
export function useCanvasGestures(onStarClick: (x: number, y: number) => void) {
  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const { handlers, gestureState } = useGestures({
    onTap: (x, y) => {
      // Convert screen coordinates to canvas coordinates accounting for transform
      const canvasX = (x - transform.translateX) / transform.scale;
      const canvasY = (y - transform.translateY) / transform.scale;
      onStarClick(canvasX, canvasY);
    },
    onDoubleTap: (x, y) => {
      // Reset zoom on double tap
      setTransform({ scale: 1, translateX: 0, translateY: 0 });
    },
    onPinchZoom: (scale) => {
      setTransform(prev => ({ ...prev, scale }));
    },
    onPan: (deltaX, deltaY) => {
      setTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY,
      }));
    },
    minScale: 0.5,
    maxScale: 3,
  });

  return { handlers, transform, gestureState };
}
