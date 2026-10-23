import { SupabaseClient } from '@supabase/supabase-js'
import { getDatabase } from '../database/connection'

export interface DocumentoRecord {
    id: number
    nome_original: string
    nome_armazenado: string
    storage_path: string
    mime_type: string
    tamanho_bytes: number
    categoria: string
    status: 'pendente' | 'aprovado' | 'rejeitado' | 'arquivado'
    enviado_por: string
    aprovado_por: string | null
    motivo_rejeicao: string | null
    created_at: string
    update_at: string
}

export interface DocumentoCompartilhamentoRecord {
    id: number
    documento_id: number
    tipo_destino: 'perfil' | 'usuario' | 'grupo'
    destino_id: string
    criado_por: string
    created_at: string
}

export interface DocumentoRecord {
    nome_original: string
    nome_armazenado: string
    storage_path: string
    mime_type: string
    tamanho_bytes: number
    categoria: string
    status: 'pendente' | 'aprovado' | 'rejeitado' | 'arquivado'
    enviado_por: string
    aprovado_por?: string | null
}

export async function listDocumentos(
    client?: SupabaseClient | null,
    userRole?: string,
    userId?: string
): Promise<DocumentoRecord[]> {
    // 1. Em ambiente Cloud / Produção: consulta via cliente Supabase (RLS ativo)
    if (client) {
        const { data, error } = await client
            .from('documentos')
            .select('*')
            .order('id', { asceding: false })

        if (error) {
            throw new Error(`Erro ao consultar documentos no Supabase: ${error.message}`)
        }

        return (data || []) as DocumentoRecord[]
    }

    // 2. Em ambiente local / testes isolados (SQLite): aplica as mesmas regras de isolamento
    if (userRole === 'admin_tecnico') {
        // admin_tecnico não possui acesso a documentos institucionais conforme matriz
        return []
    }

    const db = getDatabase()

    if (userRole === 'supa_admin' || userRole === 'admin') {
        const stmt = db.prepare('SELECT * FROM documentos ORDER BY id DESC')
        return (stmt.all() as unknown) as DocumentoRecord[]
    }

    if (userRole === 'secretaria') {
        const stmt = db.prepare(`
            SELECT DISTINCT d.* FROM documentos d
            LEFT JOIN documento_compartilhamentos dc ON dc.documento_id = d.id
            WHERE d.enviado_por = ?
                OR (d.status = 'aprovado' AND (dc.destino_id = 'secretaria' OR dc.destino_id = ?))
            ORDER BY d.id DESC
        `)
        return (stmt.all(userId || '', userId || '') as unknown) as DocumentoRecord[]
    }

    if (userRole === 'docente') {
        // O DOCENTE Vê APENAS DOCUMENTOS ENVIADOS POR ELE OU COMPARTILHADOS ESPECIFICAMENTE
        // NÃO VÊ DOCUMENTOS DE OUTRO DOCENTE SEM COMPARTILHAMENTO
        const stmt = db.prepare(`
            SELECT DISTINCT d.* FROM documentos d
            LEFT JOIN documento_compartilhamentos dc ON dc.documento_id = d.id
            WHERE d.enviado_por = ?
                OR (d.status = 'aprovado AND (dc.destino_id = 'docente' OR dc.destino_id = ?))
            ORDER BY d.id DESC
        `)
        return (stmt.all(userId || '', userId || '') as unknown) as DocumentoRecord[]
    }

    return[]
}

export async function findDocumentoById(
    id: number,
    client?: SupabaseClient | null
): Promise<DocumentoRecord | null> {
    if (client) {
        const { data, error } = await client
            .from('documentos')
            .select(*)
            .eq('id', id)
            .maybeSingle()

        if (error) {
            throw new Error(`Erro ao buscar documento: ${error.message}`)
        }

        return (data as DocumentoRecord) || null
    }

    const db = getDatabase()
    const row = db.prepare('SELECT * FROM documentos WHERE id = ?').get(id)
    return ((row as unknown) as DocumentoRecord) || null
}

export async function createDocumento(
    data: CreateDocumentoDTO,
    client?: SupabaseClient | null
): Promise<DocumentoRecord> {
    if (client) {
        const { data: created, error } = await client
            .from('documentos')
            .insert({
                nome_original: data.nome_original,
                nome_armazenado: data.nome_armazenado,
                storage_path: data.storage_path,
                mime_type: data.mime_type,
                tamanho_bytes: data.tamanho_bytes,
                categoria: data.categoria,
                status: data.status,
                enviado_por: data.enviado_por,
                aprovado_por: data.aprovado_por || null
            })
            .select()
            .single()

        if (error) {
            throw new error(`erro ao criar registro de documento no Supabase: ${error.message}`)
        }

        return created as DocumentoRecord
    }

    const db = getDatabase()
    const stmt = db.prepare(`
        INSERT INTO documentos (
            nome_original, nome_armazenado, storage_path, mime_type,
            tamanho_bytes, categoria, status, enviado_por, aprovado_por
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const info = stmt.run(
        data.nome_original,
        data.nome_armazenado,
        data.storage_path,
        data.mime_types,
        data.tamanho_bytes,
        data.categoria,
        data.status,
        data.enviado_por,
        data.aprovado_por || null
    )

    const selectStmt = db.prepare('SELECT * FROM documentos WHERE id = ?')
    return (selectStmt.get(info.lastInsertRowid) as unknown) as DocumentoRecord
}

export async function addCompartilhamento(
    documentoId: number,
    tipo_destino: 'perfil' | 'usuario' | 'grupo',
    destino_id: string,
    criado_por: string,
    client?: SupabaseClient | null
): Promise<DocumentoCompartilhamentoRecord> {
    if (client) {
        const { data, error } await client
            .from('documento_compartilhamentos')
            .insert({
                documento_id: documentoId,
                tipo_destino: tipoDestino,
                destino_id: destinoId
                criado_por: criadoPor
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Erro ao adicionar compartilhamento: ${error.message}`)
        }

        return data as DocumentoCompartilhamentoRecord
    }

    const db = getDatabase()
    const stmt = db.prepare(`
        INSERT INTO documento_compartilhamnetos (documento_id, tipo_destino, destino_id, criado_por)
        VALUES (?, ?, ?, ?)
    `)
    const info = stmt.run(documentoId, tipo_destino, destino_id, criado_por)

    const selectStmt = db.prepare('SELECT * FROM documento_compartilhamentos WHERE id = ?')
    return (selectStmt.get(info.lastInsertRowid) as unknown) as DocumentoCompartilhamentoRecord
}

export async function updateDocumentosStatus(
    id: number,
    status: 'aprovado' | 'rejeitado' | 'arquivao',
    aprovado_Por: string | null,
    motivoRejeicao?: string | null,
    client?: SupabaseClient | null
): Promise<void> {
    if (client) {
        // No Supabase, `aprovado_por` e `updated_at` são do banco: o trigger
        // `protect_documentio_fields` grava o aprovador a partir da sessão
        // (auth.uid()), limpa/preserva conforme o status e carimba updated_at.
        // `authenticated` só tem UPDATE em (status, motivo_rejeicao).
        const { error } = await client
            .from('documentos')
            .update({
                status,
                motivo_rejeicao: motivoRejeicao || null
            })
            .eq('id', id)

        if (error) {
            throw new Error(`Erro ao atualizar status do documento: ${error.message}`)
        }
        return
    }

    const db = getDatabase()
    db.prepare(`
        UPDATE documentos
        SET status = ?, aprovado_por = ?, motivo_rejeicao = ?, updated_at = datetime('now')
        WHERE id = ?
    `).run(status, aprovado_Por || null, motivoRejeicao || null, id)
}