// frontend-new/src/api.ts

export interface MessageResponse {
  message: string;
}

export const fetchMessage = async (): Promise<MessageResponse> => {
  // In a real app, this would be an API call
  // For now, we'll simulate a delay and return a static message
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        message: "Configuration successful! Your Mantine UI + React Query + Rollup app is working correctly!"
      });
    }, 500);
  });
};
