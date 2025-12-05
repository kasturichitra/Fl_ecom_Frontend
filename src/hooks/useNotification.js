import { useQuery } from "@tanstack/react-query";
import { getNotificationApi } from "../ApiServices/notificationService";

export const useNotification = ({ search = "", page = 1, limit = 10, sort = "", fromDate = "", toDate = "" } = {}) => {
  const queryKey = ["notifications", search || "", page, limit, sort, fromDate, toDate];

  return useQuery({
    queryKey,
    queryFn: () => getNotificationApi({ search, page, limit, sort, fromDate, toDate }),
    select: (res) => res?.data,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
};
