import { createContext, useState } from "react";
import { loadGdprAdsConsent } from "./utils";
import useAsyncEffect from "@/hooks/useAsyncEffect";

export interface AdMobContextProps {
  isInitialized: boolean;
}

export const AdMobContext = createContext<AdMobContextProps>(
  {} as AdMobContextProps
);

type Props = {
  children: React.JSX.Element | React.JSX.Element[];
};

export const AdMobProvider = ({ children }: Props) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useAsyncEffect(async () => {
    try {
      await loadGdprAdsConsent();
      setIsInitialized(true);
    } catch (error) {
      console.log("loadGdprAdsConsent err: ", error);
      setIsInitialized(false);
    }
  }, []);

  return (
    <AdMobContext.Provider value={{ isInitialized }}>
      {children}
    </AdMobContext.Provider>
  );
};
