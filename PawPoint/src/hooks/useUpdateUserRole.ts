// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { adminApi } from "../api/adminApi";

// export const useUpdateUserRole = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       userId,
//       role,
//     }: {
//       userId: number;
//       role: number;
//     }) => adminApi.updateUserRole(userId, { role }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin-users"] });
//     },
//   });
// };