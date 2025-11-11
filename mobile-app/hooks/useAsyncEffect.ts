import { useEffect } from "react";

const useAsyncEffect = <V>(
  effect: (isActive: () => boolean) => V | Promise<V>,
  inputs?: any[]
): void => {
  useEffect(function () {
    let result;
    let mounted = true;
    const maybePromise = effect(function () {
      return mounted;
    });

    Promise.resolve(maybePromise).then(function (value) {
      result = value;
    });

    return function () {
      mounted = false;
    };
  }, inputs);
};

export default useAsyncEffect;
