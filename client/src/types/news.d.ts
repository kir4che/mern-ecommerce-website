export interface NewsItem {
  _id: string;
  title: string;
  category: string;
  date: Date;
  content: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
