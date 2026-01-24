export interface ShowRoomData {
  id: string;
  description: string;
  images: [string];
  isEnabled: boolean;
  hotel: {
    id: string;
    title: string;
    description: string;
  };
}
