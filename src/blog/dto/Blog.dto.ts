export interface BlogDto {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
