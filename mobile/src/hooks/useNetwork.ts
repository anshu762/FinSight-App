import { useNetInfo } from '@react-native-community/netinfo';

export const useNetwork = () => {
  const netInfo = useNetInfo();
  return {
    isConnected: netInfo.isConnected ?? true,
    isInternetReachable: netInfo.isInternetReachable ?? true,
    isOffline: netInfo.isConnected === false,
  };
};
