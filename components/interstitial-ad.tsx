import { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const iosAdUnitId = "ca-app-pub-2054344840815103/2691936811";
const androidAdUnitId = TestIds.INTERSTITIAL; // テストID

// テスト用の広告ユニットID（開発時はテストID、本番時は実際のIDを使用）
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === "ios"
    ? iosAdUnitId
    : androidAdUnitId;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: [
    "productivity",
    "self-improvement",
    "task-management",
    "self-help",
  ],
  requestNonPersonalizedAdsOnly: false,
});

interface InterstitialAdHook {
  loaded: boolean;
  error: string | null;
  showAd: () => void;
  loadAd: () => void;
}

export function useInterstitialAd(): InterstitialAdHook {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeOpened = interstitial.addAdEventListener(
      AdEventType.OPENED,
      () => {
        if (Platform.OS === "ios") {
          // iOSでステータスバーを隠して、閉じるボタンが到達可能になるようにする
          StatusBar.setHidden(true);
        }
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (Platform.OS === "ios") {
          StatusBar.setHidden(false);
        }
        setLoaded(false);
        // 広告が閉じられたら新しい広告を読み込み
        interstitial.load();
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        setLoaded(false);
        setError(error.message || "Unknown error");
        // エラー後、少し待ってから再読み込みを試行
        setTimeout(() => {
          setError(null);
          interstitial.load();
        }, 5000);
      }
    );

    // 少し遅延させてから読み込みを開始
    setTimeout(() => {
      interstitial.load();
    }, 1000);

    // コンポーネントのアンマウント時にイベントリスナーを解除
    return () => {
      unsubscribeLoaded();
      unsubscribeOpened();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showAd = () => {
    if (loaded) {
      interstitial.show();
    } else {
      // エラーがある場合は先にクリア
      if (error) {
        setError(null);
      }
      // 広告が読み込まれたら自動的に表示する
      const unsubscribeLoaded = interstitial.addAdEventListener(
        AdEventType.LOADED,
        () => {
          interstitial.show();
          unsubscribeLoaded();
        }
      );
      interstitial.load();
    }
  };

  const loadAd = () => {
    if (!loaded) {
      interstitial.load();
    }
  };

  return { loaded, error, showAd, loadAd };
}
