# Shape Mover (React Native / Expo)

This is a simple React Native application built with Expo that lets the user:

- Select one of up to five predefined shapes (square, rectangle, circle, triangle, diamond).
- Move the selected shape up, down, left, and right in 10-pixel steps using on-screen arrow buttons.
- Prevent the shape from moving outside the visible play area.

## Getting started

1. Install the Expo CLI tools if you do not already have them:

```bash
npm install -g expo-cli
```

2. Install dependencies:

```bash
cd shape-mover-app
npm install
```

3. Run the development server:

```bash
npm run start
```

Then use the Expo Go app on your Android device (or an emulator) to scan the QR code. On Windows, you can also connect a physical iOS device with Expo Go; for iOS simulator builds you need access to a macOS machine or cloud build.

## Building for app stores

This project is configured to use EAS Build for generating store-ready binaries.

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Configure EAS in the project:

```bash
cd shape-mover-app
eas build:configure
```

3. Build for Android:

```bash
npm run build:android
```

4. Build for iOS (requires an Apple Developer account):

```bash
npm run build:ios
```

EAS will guide you through connecting your Google Play Console and Apple App Store Connect accounts and will produce the appropriate `.aab` (Android) and `.ipa` (iOS) artifacts for uploading to the respective app stores.

