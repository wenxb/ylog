import {z} from "zod"

export const pageVer = z.object({
    page: z.preprocess((val) => Number(val), z.number().min(0).default(1)),
    pageSize: z.preprocess((val) => Number(val), z.number().min(1).default(10)),
})
