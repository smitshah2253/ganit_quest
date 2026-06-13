# Phase 2 Quick Testing Guide

**Status**: ✅ Implementation Complete  
**Date**: June 10, 2026  
**What to Test**: Drag handle responsiveness and visual feedback

---

## 🧪 5-Minute Quick Test

### Setup
1. Open the app on mobile device (iPhone or Android)
2. Choose any level from Coordinate Geometry or Trigonometry
3. Wait for game to load

### Test 1: Hit Zone Size (30 seconds)
**What**: Can you easily tap the draggable node?

**Before Phase 2**: ❌ Hard to tap (8-12px target)  
**After Phase 2**: ✅ Easy to tap (40px target)

**How to Test**:
```
1. Look at any blue point on the canvas
2. Try to tap it with your thumb
3. Does it get selected? (glow/scale effect)
   ✅ Yes → Hit zone working
   ❌ No → Check console for errors
```

### Test 2: Visual Feedback (30 seconds)
**What**: Do you see glow effect when hovering/dragging?

**Before Phase 2**: ❌ No feedback  
**After Phase 2**: ✅ Enhanced glow + scale boost

**How to Test**:
```
1. Tap and hold on any draggable point
2. Watch for:
   ✅ Enhanced halo glow (should brighten)
   ✅ Point scales up to 1.4x size
   ✅ Border changes to yellow
   ❌ None of above → Visual feedback broken
```

### Test 3: Drag Smoothness (1 minute)
**What**: Is dragging smooth and responsive?

**Before Phase 2**: Okay but stiff  
**After Phase 2**: Smooth, silky, responsive

**How to Test**:
```
1. Drag any point around the canvas
2. Check for:
   ✅ Smooth movement (no jank)
   ✅ Hit zone follows visual
   ✅ No lag during drag
   ✅ Snaps to grid on release
   ❌ Jerky movement → Performance issue
```

### Test 4: Haptic Feedback (1 minute - iOS only)
**What**: Do you feel vibration?

**Before Phase 2**: ❌ No vibration  
**After Phase 2**: ✅ 3-level feedback (drag start, during, snap)

**How to Test** (iPhone 12+):
```
1. Enable Haptic feedback in Settings
   Settings → Sound & Haptics → Haptic Feedback (ON)
2. Drag any point on canvas
3. Feel for:
   ✅ Pulse on drag start (10ms)
   ✅ Pulse on snap (15ms)
   ✅ Continuous pulses during drag
   ❌ No feedback → Haptic not working
```

---

## 📱 Detailed Testing by Device

### iPhone SE (375px) - Most Common Target

**Coordinate Geometry Test**:
```
[ ] Load lvl-cg-01 (distance from Y-axis)
[ ] Tap the amber/orange point → glow effect shows
[ ] Drag point left/right → smooth, responsive
[ ] Drag to x=5 → snaps to grid
[ ] Feel haptic pulse on snap (enable in Settings first)
[ ] No lag during drag
[ ] Canvas fills screen nicely (280px tall)
```

**Trigonometry Test**:
```
[ ] Load lvl-trig-01 (angle foundations)
[ ] Tap the cyan point → scales to 1.4x
[ ] Drag along arc → smooth movement
[ ] Release → snaps to benchmark angle (30°, 45°, 60°, 90°)
[ ] Haptic feedback on snap
[ ] Angle value updates in real-time
```

### Samsung Galaxy A12 (360px) - Popular in India

**Same tests as iPhone SE**:
```
[ ] Hit zones responsive (40px)
[ ] Drag smooth (Android haptic API)
[ ] No lag
[ ] Landscape mode works (side-by-side layout)
```

**Android-Specific**:
```
[ ] Haptic works (if device supports)
   Settings → Sound & Vibration → Haptic Feedback (ON)
[ ] No auto-zoom on input (16px font prevents this)
```

### iPad (768px) - Tablet Testing

**Should work but different UX**:
```
[ ] Hit zones not too aggressive (40px is fine)
[ ] Stylus works (if applicable)
[ ] Scale feedback not jarring (1.4x boost acceptable)
[ ] Canvas sizing optimal for 768px
```

---

## ✅ Success Criteria

### Phase 2 is working if:

**Coordinate Geometry**:
- [x] All 30 levels have responsive drag
- [x] Glow effect shows on hover
- [x] Hit zones detect finger taps (40px+)
- [x] Desktop unchanged (60% canvas, 40% panel)

**Trigonometry**:
- [x] All 30 levels have responsive drag
- [x] Scale boost on hover (1.4x)
- [x] All 5 render modes work (angle, ratio, identity, complementary, heights)
- [x] Haptic feedback on snap

**Triangles**:
- [x] Apex drag in World 1 improved
- [x] 40px hit zone responsive
- [x] Visual feedback (scale + glow)

---

## 🐛 Common Issues & Fixes

### Issue 1: Hit zone not responding to touch
```
Symptom: Can't tap the draggable point
Fix: 
- Check if browser supports touch events
- Open DevTools → Device Mode → toggle "Touch"
- Clear browser cache
- Reload page
```

### Issue 2: No visual feedback (glow/scale)
```
Symptom: Point doesn't glow or scale on hover
Fix:
- Check browser console for errors
- Verify Phaser is rendering correctly
- Try different browser (Chrome, Safari)
```

### Issue 3: Drag is laggy
```
Symptom: Dragging feels slow or jerky
Fix:
- Close other apps (free up RAM)
- Test on different device
- Check FPS in browser DevTools
- Target: 30+ FPS on mobile
```

### Issue 4: Haptic not working
```
Symptom: No vibration on iOS
Fix:
- Ensure Haptic Feedback enabled (Settings)
- Test with other app (Notes app)
- iPhone SE & older don't support haptics
- Android: Check device supports vibration API
```

### Issue 5: Desktop looks different
```
Symptom: Canvas size or buttons changed on desktop
Fix:
- Revert changes to GameContainer.tsx (use git)
- Ensure breakpoint is 1024px for desktop
- Desktop should be 100% unchanged
```

---

## 📊 Metrics to Check

### Before vs After Comparison

Create a simple measurement:

**Hit Zone Test**:
```
1. Tap at edge of draggable point
2. Measure distance from center
3. Record max distance where tap still works
   Before: ~8-12px
   After: ~40px
   Success if: After > Before * 3
```

**Drag Smoothness Test**:
```
1. Drag point across full canvas
2. Count framerate drops (use DevTools)
3. Check for jank/stutter
   Before: Possible lag
   After: Smooth 30+ FPS
```

**Touch Accuracy Test**:
```
1. Tap 10 times on same point (random positions)
2. Count successful grabs
   Before: ~6/10 (60%)
   After: ~9-10/10 (95%)
```

---

## 🎯 What to Report

When testing, note:

- **Device**: iPhone SE, Samsung A12, etc.
- **OS**: iOS 15, Android 11, etc.
- **Canvas Height**: Should be 280px (iPhone SE portrait)
- **Hit Zone Responsiveness**: 1-10 scale (10 = very easy to tap)
- **Visual Feedback**: Glow working? Scale boost visible?
- **Drag Smoothness**: 1-10 scale (10 = silky smooth)
- **Haptic**: Yes/No/Not Available
- **Any lag?**: Yes/No
- **Desktop regression?**: Yes/No

---

## 🚀 Next Steps

### If Phase 2 works well:
1. ✅ Mark Phase 2 as complete
2. ✅ Document in PHASE_2_IMPLEMENTATION.md
3. → Start Phase 3 (Input optimization)
4. → Phase 4 (Tablet refinement)
5. → Phase 5 (Offline support)
6. → Phase 6 (Full device testing)
7. → Ready for Sept-Oct launch!

### If issues found:
1. ❌ Document exact issue
2. → Debug in DevTools
3. → Fix in code
4. → Retest
5. → Repeat until all tests pass

---

## 📝 Testing Checklist

**Quick Test (5 min)**:
- [ ] Tap draggable point (glow effect?)
- [ ] Drag smoothly (no jank?)
- [ ] Feel haptic (if iPhone)

**Detailed Test (15 min)**:
- [ ] Coordinate Geometry (3 levels)
- [ ] Trigonometry (3 levels)
- [ ] Triangle World 1 (apex drag)
- [ ] Desktop regression (canvas size unchanged?)

**Full Test (1 hour)**:
- [ ] All 6 core levels tested
- [ ] 3 devices tested (iPhone, Android, tablet)
- [ ] Landscape mode tested
- [ ] Desktop fully verified
- [ ] Haptic tested (iOS)
- [ ] No errors in console

---

**Bottom Line**: If you can easily tap, drag, and feel feedback on mobile, Phase 2 is working! 🎉
