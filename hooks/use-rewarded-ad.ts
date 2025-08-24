import { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// テスト用の広告ユニットID（開発時はテストID、本番時は実際のIDを使用）
const adUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-3940256099942544/5224354917";

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ["productivity", "self-improvement"],
});

interface RewardedAdHook {
  loaded: boolean;
  showAd: () => void;
  loadAd: () => void;
  onRewardEarned?: (reward: any) => void;
}

export function useRewardedAd(
  onRewardEarned?: (reward: any) => void
): RewardedAdHook {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward:", reward);
        onRewardEarned?.(reward);
      }
    );

    // 初回広告を読み込み
    rewarded.load();

    // コンポーネントのアンマウント時にイベントリスナーを解除
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [onRewardEarned]);

  const showAd = () => {
    if (loaded) {
      rewarded.show();
      // 広告表示後にステータスバーを制御（iOS）
      if (Platform.OS === "ios") {
        StatusBar.setHidden(true);
        // 広告が閉じられたことを検知するためにタイマーを使用
        setTimeout(() => {
          StatusBar.setHidden(false);
        }, 30000); // 30秒後にステータスバーを再表示
      }
    }
  };

  const loadAd = () => {
    if (!loaded) {
      rewarded.load();
    }
  };

  return { loaded, showAd, loadAd };
}
