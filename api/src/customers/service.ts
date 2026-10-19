import { db } from "@/db"
import { fail } from "@/infra/catch"

export const findOwn = async (id: string, mid: string) => {
    const customer = await db.profile.findFirst({ where: { id, matchmakerId: mid } })
    if (!customer) throw fail(404, "customer not found")
    return customer
}
