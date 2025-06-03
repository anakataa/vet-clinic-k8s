export interface PostDto {
  id: number;
  title: string;
  description: string | null;
  content: string;
  userId: number;
  blogId: number;
  createdAt: Date;
  updatedAt: Date;
}
