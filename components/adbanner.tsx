import React, { useRef } from "react";
import { Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

const iosAdUnitId = "ca-app-pub-2054344840815103/6971729651";
const androidAdUnitId = TestIds.BANNER; // テストID

// テスト用の広告ユニットID（開発時はテストID、本番時は実際のIDを使用）
const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === "ios"
    ? iosAdUnitId
    : androidAdUnitId;

interface AdBannerProps {
  size?: BannerAdSize;
  className?: string;
}

export default function AdBanner({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  className,
}: AdBannerProps) {
  const bannerRef = useRef<BannerAd>(null);

  // iOSの場合、アプリがフォアグラウンドに戻った時に広告を再読み込み
  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  return (
    <BannerAd
      ref={bannerRef}
      unitId={adUnitId}
      size={size}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}
