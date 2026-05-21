# React Native Mobile Conversion Guide

This document outlines the architecture, setup, and engineering steps required to convert the **GanitQuest** web application into a cross-platform **React Native (Expo)** mobile application.

---

## 1. Migration Architecture

The primary challenge of converting GanitQuest to a mobile application is integrating the **Phaser 3** engine (designed for HTML5 browsers) into the native mobile thread. We have two primary strategies:

```
                  ┌───────────────────────────────┐
                  │      React Native / Expo      │
                  └───────────────┬───────────────┘
                                  │
             ┌────────────────────┴────────────────────┐
             ▼                                         ▼
┌──────────────────────────┐              ┌──────────────────────────┐
│   Option A: WebView      │              │   Option B: RN Skia      │
│  (Highly Recommended)    │              │   (Native Refactoring)   │
├──────────────────────────┤              ├──────────────────────────┤
│ • Wrap Web Phaser in     │              │ • Re-write game UI using │
│   react-native-webview   │              │   shopify/react-native-  │
│ • Zero asset rewrite     │              │   skia & Reanimated      │
│ • Local web server asset │              │ • Best performance       │
└──────────────────────────┘              └──────────────────────────┘
```

---

## 2. Option A: Web-to-Mobile WebView Bridge (Fastest GTM)

In this approach, the Phaser canvas continues to run in an optimized local HTML environment inside a React Native **WebView**. React Native handles the user login, chapters list, and settings, communicating with WebView through JSON message bridges.

### Step 1: Install React Native WebView
```bash
npx expo install react-native-webview
```

### Step 2: Bundle Phaser Assets Locally
1. Compile the Phaser code into static bundle files (HTML, JS, and Images).
2. Place the assets inside the React Native project's `assets/web/` directory.

### Step 3: Implement the WebView Component
Inside your React Native screen, render the canvas:

```typescript
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export const MobileGameContainer = ({ levelId }: { levelId: string }) => {
  const webViewRef = useRef<WebView>(null);

  // Send levelId when webview loads
  const sendLevelToPhaser = () => {
    const message = JSON.stringify({ type: 'load-level', levelId });
    webViewRef.current?.postMessage(message);
  };

  // Receive drag coordinate snaps from Phaser
  const handleMessageFromPhaser = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'coordinate-point-dragged') {
      console.log('Snapped Grid:', data.x, data.y);
      // Update React Native state stores
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'file:///android_asset/web/index.html' }} // Android local asset
        // source={require('./assets/web/index.html')} // iOS local asset
        onLoadEnd={sendLevelToPhaser}
        onMessage={handleMessageFromPhaser}
        allowFileAccess={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecf2f7' },
});
```

---

## 3. Option B: Native Canvas Refactoring (Performance)

If you require native 120 FPS render performance, you should replace Phaser with **React Native Skia** combined with **React Native Reanimated** for gestures.

### Dependency Stack
```bash
npx expo install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

### Drag-and-Snap Coordinate Grid implementation (RN Skia + Gesture Handler)
```typescript
import React from 'react';
import { Dimensions } from 'react-native';
import { Canvas, Circle, Line, Text, useFont } from '@shopify/react-native-skia';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue, useDerivedValue, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const centerX = width / 2;
const centerY = height / 2;
const spacing = width / 24;

export const NativeCoordinateLab = () => {
  const pointX = useSharedValue(centerX);
  const pointY = useSharedValue(centerY);

  // Gesture mapping
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      pointX.value += event.changeX;
      pointY.value += event.changeY;
    })
    .onEnd(() => {
      // Snapping to integer grid lines
      const snapGridX = Math.round((pointX.value - centerX) / spacing);
      const snapGridY = Math.round(-(pointY.value - centerY) / spacing);
      
      pointX.value = withSpring(centerX + snapGridX * spacing);
      pointY.value = withSpring(centerY - snapGridY * spacing);
    });

  // Calculate live snapped lines
  const lineX = useDerivedValue(() => pointX.value);
  const lineY = useDerivedValue(() => pointY.value);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <Canvas style={{ flex: 1, backgroundColor: '#ecf2f7' }}>
          {/* Projections to axes */}
          <Line p1={{ x: centerX, y: centerY }} p2={{ x: lineX.value, y: lineY.value }} color="#64748b" strokeWidth={1.5} />
          
          {/* Draggable Circle Node */}
          <Circle cx={pointX} cy={pointY} r={12} color="#f59e0b" />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
```

---

## 4. UI Framework and State Migrations

### A. Icons and Layouts
- Replace `lucide-react` with `@expo/vector-icons` (includes MaterialIcons, Feather, Ionicons).
- Replace HTML Tailwind/CSS selectors with React Native `StyleSheet` styling wrappers.
- Swap React Router Dom routes with `@react-navigation/native` (Stack, Drawer, or Tabs navigation).

### B. Zustand State persistence on Mobile
React Native doesn't support HTML `localStorage`. Migrate the `authStore` to use Expo's **SecureStore** (for tokens) and **AsyncStorage** (for progress state).

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useMobileGameStore = create(
  persist(
    (set) => ({
      xp: 0,
      stars: 0,
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
    }),
    {
      name: 'ganitquest-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```
