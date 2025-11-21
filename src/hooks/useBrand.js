import { useQuery } from "@tanstack/react-query"
import { getAllBrandApi } from "../ApiServices/brandService"



export const useGetAllBrands = ({searchTerm = "", page = 1, limit = 10}) =>{

    const queryKey = ["brands", searchTerm || "", page, limit]

    return useQuery({
        queryKey,
        queryFn : () => getAllBrandApi({searchTerm, page, limit}),
        select : (res) => res.data.data,
        staleTime : 10 * 60 * 1000,
        cacheTime : 30 * 60 * 1000,  
        refetchOnMount : false
    })

}