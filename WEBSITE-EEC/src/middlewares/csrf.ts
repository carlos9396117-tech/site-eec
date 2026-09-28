import type { Context, Next } from  'hono'
import { getEnv } from '../config/env'

const MUTATIVIDADE_METHODS =  new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Rotas mutativas sem verificação de origem.
 * 
 * `/api/auth/login` ESTAVA aqui e foi removido. A justificativa original era
 * que rotas públicas "não necessitam de verificação CSRF baseada em sessão" -
 * o que é verdade para um mecanismo com token de sessão, mas não descreve este
 * middleware, que valida exclusivamente e ORIGEM da requisição e não depende
 * da sessão alguma. Nada impedia o login de ser protegido antes da
 * autentificação, e a isenção abria login-CSRF: um site externo podia forçar a 
 * vítima a entrarna conta do atacante a seguir operando dentro dela.
 * 
 * As duas que permaneçem não tem equivalente desse risco:
 *  - `/api/contato`: formulário público do site. Forçá-lo produz uma mensagem
 *     de contato indesejada, sem privilégio do site, sem sessão e sem efeito sobre a 
 *     conta de quem oi induzido;
 *  - `/api/auth/recuperar-senha`: dispara e-mail para o endereço informadono 
 *     corpo. Forçá-lo não altera nada na conta da vítima nem revela se ela
 *     existe, e a rota tem limite de 3 por minuto.
 */