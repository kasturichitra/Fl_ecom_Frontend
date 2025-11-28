import { useQuery } from "@tanstack/react-query"
import { getNotificationApi } from "../ApiServices/notificationService"





export const useNotification = () => {

    return useQuery({
        queryKey: ["notification"],
        queryFn: () => getNotificationApi(),
        select: (res) => res.data.respones,
    })

}