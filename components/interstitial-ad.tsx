import { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// テスト用の広告ユニットID（開発時はテストID、本番時は実際のIDを使用）
const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-3940256099942544/1033173712";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ["productivity", "self-improvement"],
});

interface InterstitialAdHook {
  loaded: boolean;
  showAd: () => void;
  loadAd: () => void;
}

export function useInterstitialAd(): InterstitialAdHook {
  const [loaded, setLoaded] = useState(false);

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
        console.log("Interstitial ad error:", error);
        setLoaded(false);
      }
    );

    // 初回広告を読み込み
    interstitial.load();

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
    }
  };

  const loadAd = () => {
    if (!loaded) {
      interstitial.load();
    }
  };

  return { loaded, showAd, loadAd };
}
