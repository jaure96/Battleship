import * as StoreReview from "expo-store-review";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_REVIEW_KEY = "last_review_request_timestamp";
const MIN_DAYS_BETWEEN_REQUESTS = 30;
const MIN_INTERACTIONS = 5;
const INTERACTION_COUNT_KEY = "review_interaction_count";

export const useStoreRating = () => {
  const requestReview = async () => {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (!isAvailable) return;

      const hasAction = await StoreReview.hasAction();
      if (!hasAction) return;

      const lastTimestamp = await AsyncStorage.getItem(LAST_REVIEW_KEY);
      if (lastTimestamp) {
        const daysSinceLast =
          (Date.now() - Number(lastTimestamp)) / (1000 * 60 * 60 * 24);

        if (daysSinceLast < MIN_DAYS_BETWEEN_REQUESTS) {
          return;
        }
      }

      const interactionCount = Number(
        await AsyncStorage.getItem(INTERACTION_COUNT_KEY)
      );

      if (interactionCount < MIN_INTERACTIONS) {
        await AsyncStorage.setItem(
          INTERACTION_COUNT_KEY,
          String(interactionCount + 1)
        );
        return;
      }

      await StoreReview.requestReview();

      await AsyncStorage.setItem(LAST_REVIEW_KEY, Date.now().toString());
      await AsyncStorage.setItem(INTERACTION_COUNT_KEY, "0");
    } catch (error) {
      console.warn(
        "Store review request failed:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  return { requestReview };
};
