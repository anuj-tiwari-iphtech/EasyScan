# EasyScan

A simple mobile app built with React Native and Expo that scans QR codes and barcodes, and reads vehicle number plates from photos.

## Features

- **QR code and barcode scanner**
  - Live camera scanning with a target box (only codes inside the box are accepted)
  - Pinch to zoom
  - Links (`http` / `https`) open automatically
  - Scanned text can be selected and copied
- **Number plate scanner**
  - Upload a photo from your gallery
  - Shows the plate number, state (Indian plates), country code, and vehicle type
  - Shows "Not found" when nothing can be read
  - Tries extra readings and fixes look-alike characters (like `O` and `0`) to help with blurry photos
- **Splash screen** that opens the home screen after a few seconds

## Tech Stack

- React Native + Expo (Expo Router for navigation)
- `expo-camera` for scanning
- `expo-image-picker` and `expo-image-manipulator` for choosing and preparing photos
- `react-native-gesture-handler` for pinch zoom
- [Plate Recognizer](https://platerecognizer.com) API for reading plates

## Getting Started

### 1. Requirements

- Node.js (LTS version)
- The **Expo Go** app on your phone, or an Android emulator / iOS simulator

### 2. Install

```bash
npm install
```

### 3. Add your API token

Create a file named `.env` in the project root (next to `package.json`):

```
EXPO_PUBLIC_PLATE_TOKEN=your_plate_recognizer_token
```

- Get a token by signing up at [platerecognizer.com](https://platerecognizer.com).
- No quotes, no spaces around `=`.
- Do not upload this file to GitHub. Add `.env` to `.gitignore`.

### 4. Run

```bash
npx expo start 
```

Then scan the QR code with Expo Go, or press `a` for Android / `i` for iOS.

> Use `-c` whenever you create or change `.env`, so the new value is picked up.

The camera scanner is best tested on a **real phone**. Emulators usually show a black or fake camera feed.

## Project Structure

```
EasyScan/
  app/
    _layout.tsx        Navigation setup
    index.tsx          Splash screen
    home.tsx           Home screen
    scanner.tsx        QR / barcode scanner
    plate.tsx          Number plate scanner
  utils/
    plate.ts           Plate format check and state lookup
    plateRecognizer.ts API call to Plate Recognizer
  .env                 API token (not committed)
  app.json             Expo configuration
```

## How It Works

**Scanner:** the camera reads codes and reports where each code is on screen. The app only accepts a code if it is inside the target box, then shows the result or opens the link.

**Plate scanner:** the chosen photo is resized and sent to the Plate Recognizer API. The API returns the plate text, country code, vehicle type, and alternative readings. For Indian plates, the first two letters (for example `UP`) are matched against a list of state codes to find the state.

## Notes and Limits

- State lookup works for **Indian plates only**. Other countries show the plate and country code.
- The state shows where the vehicle was **registered**, not where it is now.
- Very blurry or low-resolution photos may still fail.
- The API token is bundled into the app, which is fine for learning and testing. For a real release, call the API through your own backend.
- The free trial of Plate Recognizer has usage limits. Check your dashboard for details.

## Common Problems

| Problem | Fix |
|---|---|
| "Missing API token" | Check the `.env` name and location, then restart with `npx expo start -c` |
| Camera is black | Test on a real device and make sure camera permission is allowed |
| Module not found | Run `npm install`, then restart with `npx expo start -c` |
| Pinch zoom does nothing | Make sure the app is wrapped in `GestureHandlerRootView` in `app/_layout.tsx` |