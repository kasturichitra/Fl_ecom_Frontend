import { useMutation } from "@tanstack/react-query"
import { storeFcmToken } from "../ApiServices/userService"

export const useStoreFcmToken = () => {
    return useMutation({
        mutationFn: ({token, userId = "69259c7026c2856821c44ced"}) => storeFcmToken(token, userId)
    })
}