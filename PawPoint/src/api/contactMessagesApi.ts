import { apiClient } from "./client";
import {
  CONTACT_MESSAGES_ENDPOINT,
  ADMIN_CONTACT_MESSAGES_ENDPOINT,
} from "./endpoints/endpoints";

export type ContactMessageReply = {
  id: number;
  senderUserId: number;
  senderType: string;
  senderName: string;
  message: string;
  createdAt: string;
};

export type ContactMessageItem = {
  id: number;
  userId: number;
  userFullName: string;
  email: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  replies: ContactMessageReply[];
};

export type CreateContactMessageRequest = {
  title: string;
  description: string;
};

export type ReplyContactMessageRequest = {
  message: string;
};

export const contactMessagesApi = {
  create: async (payload: CreateContactMessageRequest) => {
    const { data } = await apiClient.post<ContactMessageItem>(
      CONTACT_MESSAGES_ENDPOINT,
      payload
    );
    return data;
  },

  getMine: async () => {
    const { data } = await apiClient.get<ContactMessageItem[]>(
      `${CONTACT_MESSAGES_ENDPOINT}/mine`
    );
    return data;
  },

  getAdminAll: async () => {
    const { data } = await apiClient.get<ContactMessageItem[]>(
      ADMIN_CONTACT_MESSAGES_ENDPOINT
    );
    return data;
  },

  getAdminById: async (id: number) => {
    const { data } = await apiClient.get<ContactMessageItem>(
      `${ADMIN_CONTACT_MESSAGES_ENDPOINT}/${id}`
    );
    return data;
  },

  replyAsAdmin: async (id: number, payload: ReplyContactMessageRequest) => {
    const { data } = await apiClient.post(
      `${ADMIN_CONTACT_MESSAGES_ENDPOINT}/${id}/reply`,
      payload
    );
    return data;
  },
};