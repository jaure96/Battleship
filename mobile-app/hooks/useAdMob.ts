import { AdMobContext } from "@/context/AdMobContext/AdMobContext";
import { useContext, useMemo } from "react";

const useAdMob = () => {
  const { isInitialized } = useContext(AdMobContext);

  const shouldDisplayAds = useMemo(() => isInitialized, [isInitialized]);

  return {
    shouldDisplayAds,
  };
};

export default useAdMob;
