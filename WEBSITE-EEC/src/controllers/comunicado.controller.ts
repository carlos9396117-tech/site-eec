import type { Context } from 'hono'
import { createHonoSupabaseClient  } from '../lib/supabase'
import type { AuthUser } from '../types/auth'
import { createComunicadoSchema } from '../schemas/comunicado.schema'
import {
    archiveUserComunicado,
    createUserComunicado,
    getComunicado,
    listUserComunicados,
    publishUserComunicado
} from '../services/comunicado.service'
import { HttpError } from '../errors/http-error'

export async function listComunicadosHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)

    const comunicados = await listUserComunicados(user, client)
    return c.json({ sucess: true, data: comunicados })
}

export async function getComunicadoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Indentificador de comunicação inválido.')
    }

    const comunicado = await getComunicado(id, user, client)
    return c.json({ sucess: true, data: comunicado })
}

export async function createComunicadoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)

    const body = c.req.json().catch(() => null)
    if (!body) {
        throw new HttpError(400, 'Corpo da requisição inválido.')
    }

    const parseResult = createComunicadoSchema.safeParse(body)
    if (!parseResult.sucess) {
        const errorMsg = parseResult.error.issues.map((i: { message: string }) => i.message).join(',')
        throw new HttpError(400, `Dados inválidos: ${errorMsg}`)
    }

    const created = await createUserComunicado(parseResult.data, user, client)
    return c.json({ sucess: true, data: created }, 201)
}

export async function publishComunicadoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError (400, 'Identificador de comunicado inválido.')
    }

    await publishUserComunicado(id, user, client)
    return c.json({ sucess: true, message: 'Comunicado publicado comm sucessso'})
}

export async function archiveUserComunicadoHandler(c: Context) {
    const user = c.get('user') as AuthUser
    const client = createHonoSupabaseClient(c)
    const id = parseInt(c.req.param('id'), 10)

    if (isNaN(id)) {
        throw new HttpError(400, 'Identificador de comunicado inválido.')
    }

    await archiveUserComunicado(id, user, client)
    return c.json({ sucess: true, message: 'Comunicado arquivado com sucesso'})
}