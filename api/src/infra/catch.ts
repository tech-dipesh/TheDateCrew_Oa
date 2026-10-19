import type { ErrorRequestHandler, Request, RequestHandler, Response } from "express"

type Handler<B> = (req: Request<Record<string, string>, unknown, B>, res: Response) => Promise<unknown>

export const fail = (status: number, message: string) => Object.assign(new Error(message), { status })

export const withCatch = <B = unknown>(fn: Handler<B>): RequestHandler<Record<string, string>, unknown, B> => async (req, res, next) => {
    try { await fn(req, res) } catch (err) { next(err) }
}

export const errorHandler: ErrorRequestHandler = (err: Error & { status?: number }, _req, res, _next) => {
    const status = err.status ?? 500
    if (status >= 500) console.error(err)
    res.status(status).json({ error: status < 500 ? err.message : "something went wrong" })
}
