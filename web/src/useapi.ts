import { useEffect, useState } from "react"
import { api, msg } from "@/api"

export function useApi<T>(path: string) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState("")
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let live = true
    const load = async () => {
      try { const res = await api<T>(path); if (live) { setData(res); setError("") } } catch (err) { if (live) setError(msg(err)) }
    }
    void load()
    return () => { live = false }
  }, [path, tick])
  return { data, error, loading: !data && !error, reload: () => { setTick((t) => t + 1) } }
}
