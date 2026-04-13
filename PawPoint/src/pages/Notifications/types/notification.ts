export type NotificationDto = {
  id: number;
  name: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  typeId: number;
  typeName: string;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};