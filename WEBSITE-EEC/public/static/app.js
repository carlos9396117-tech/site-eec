/**
 * ===========================================================
 * ESCOLA ESTADUAL DO CARIRI (EEC) - APLICAÇÃO FRONTEND
 * ===========================================================
 * 
 * Arquivo: public/static/app.js
 * Descrição: Lógica interativa do frontend a aplicação
 * 
 * Este arquivo contém:
 *  1. Inicialização da aplicação (OMContentLoaded)
 *  2. Controle da Navbar (scroll efect, menu mobile)
 *  3. Hero Slider (slideshow automático)
 *  4. Carregamento dinâmico de dados via API
 *  5. Contadores animados
 *  6. formulário de contato
 *  7. Efeitos de scroll e smooth scrool
 */



















































    /**
     * Preloader - Oculte a tela de carregamnto
     * Delay de 1500ms (1.5 segundos) para dar tempo de carregar assets
     * 
     * Ações:
     *  1. Localiza o elemento preloader
     *  2. Adiciona classe 'hidden para ocultar
     *  3. Restaura overflow do body para permitir scroll
     */
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');      // Oculta preloader
            document.body.style.overflow = 'auto';  // Permite scroll
        }
    }, 1500);

    // =====================================================================
    // INICIALIZAÇÃO DOS MÓDULOS DE UI
    // =====================================================================

    initNavbar();       // Navbar: efeito de scroll e highlight de seção ativa
    initMobileMenu();   // Menu mobile: toggle do hamburguer menu
    initCounters();     // Contadores: animação de números crescentes
    initScrollEffects(); // Scroll: smooth scroll para âncoras
    initContactForm();  // Formulário: validação e envio

    // ========================================================================
    // CARREGAMENTO DE CONTEÚDO DINÃMICO VIA API
    // ========================================================================

    loadCursos();       // Carrega lista de cursos da API
    loadProesores();    // Carrega lista de professores da API
    loadEventos();      // Carrega calendário de eventos da API
    loadDiferenciais(); // Carrega diferenciais da escola da API
    initHeroSlider();   // Inicializa slideshow do hero section
});

// ====================================================================
// NAVBAR - Efeito de scroll e Navegação Ativa
// ====================================================================

/**
 * Função: initNavbar
 * Descrição: Conttrola o comportamento de navbar durante o scroll
 * 
 * Funcionalidades:
 *  1. Adiciona classe 'scrolled' quando rola mais de 50px (efeito visual)
 *  2. Destaca o link de navegação correspondente à seção visível
 * 
 * Elementos manipulados:
 *  - #navbar: Elemento principal da navegação
 *  - .nav-link: links de navegação
 *  - section[id]: Seções com ID para navegação por âncora
 */
function initNavbar() {
    // Seleciona elementos do DOM
    const nabar = document.getElementById('navbar');        // Navbar principal
    const navLinks = document.querySelectorAll('.nav-link'); // Todos os links de nav
    const sections = document.querySelectorAll('section[id]'); // Seções com ID

    /**
     * Função interna: updateNavbar
     * Chamada a cada evento de scroll para atualizar o estado da navbar
     */
    function updateNavbar() {
        // ===== EFEITO DE SCROLL NA NAVBAR =====
        // Adiciona/remove classe 'scrolled'  baseado na posição do scroll
        // A classe 'scrolled' geralmente adiciona background, sombra, etc.
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');   // Scroll > 50px: navbar compacta
        } else {
            navbar.classList.remove('scrolled'); // Scroll <= 50px: navbar transparente
        }

        // ===== HIGHLIGHT DO LINK ATIVO =====
        // Determina qual seção está atualmente visível na viewport
        let current = '';
        sections.forEach(section => {
            // Calcula a posição do topo da seção (com offset de 150px)
            const sectionTop = secion.offsetTop - 150;
            // Se o scroll passou do topo da seção, esta é a seção atual
            if (window.scrollY >= section) {
                current = section.getAttribute('id');
            }
        });

        // Remove classe 'active' de todos os links e adiciona ao link correto
        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove highlight de todos
            // Adiciona highlight se o href bate com a seção atual
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Registra listener para evento de scroll
    window.addEventListener('scroll', updateNavbar);
    // Executa uma vez imediatamente para definir estado inicial
    updateNavbar();
}


// =================================================================
// MOBILE MENU - Menu Hamburguer para Dispositivos Móveis
// =================================================================

/**
 * Função: initMobileMenu
 * Descrição: Controla o menu hamburguer em dispositivos móveis
 * 
 * Funcionalidades:
 *  1. Toggle do menu ao clicar no botão hamburguer
 *  2. Troca de ícone entre barras (≡) e X (X)
 *  3. Fecha menu automaticamente ao clicar em um link
 * 
 * Elementos:
 *  - #mobile-menu-btn: Botão hamburguer (3 barras)
 *  - #mobile-menu: Container do menu mobile (hidden por padrão)
 */
function initMobileMenu() {
    // Seleciona elementos do DOM
    const btn = document.getElementById('mobile-menu-btn'); // Botão hamburguer
    const menu = document.getElementById('mobile-menu');    // Container do menu
    let isOpen = false; // Estado do menu (aberto/fechado)

    // Validação: sai se os elementos não existirem
    if (!btn || !menu) return;

    /**
     * Event: Click no botão hamburguer
     *  Alterna o estado do menu (abre/fecha)
     */
    btn.addEventListener('click', () => {
        isOpen = !isOpen; // Inverte o estado

        // Toggle da classe 'hidden': adiciona se fechado, remove se aberto
        menu.classList.toggle('hidden', !isOpen);

        // Troca o ícone do botão
        // Aberto: mostra X (fa-times) | Fechado: mostra barras (fa-bars)
        setIconOnlyButton(btn, isOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl');
    });

    /**
     * Event: Click em links do menu
     * Fecha o menu automaticamente após navegação
     */
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;                             // Fecha o menu
            menu.classList.add('hidden');              // Oculta o container
            setIconOnlyButton(btn, fas fa-bars text-xl) // Restaura o ícone
        });
    });
}

// ===================================================================
// CONTADORES ANIMADOS - Animações de Números Crescentes
// ===================================================================

/**
 * Função: initCounters
 * Descrição: Inicializa contadores animados usando Intersection Oberver
 * 
 * Funcionamento:
 *  1. Seleciona todos os elementos com classe .counter ou .counter-stat
 *  2. Observa quando entram na viewport (50% visível)
 *  3. Inicia animação de contagem de 0 até o valor final
 *  4. Para de observar após animar (anima apenas uma vez)
 * 
 * Atributos HTML esperados:
 *  - data-target: Valor final do contador (ex: "1250")
 *  - data-suffix: Sufixo opcional (ex: "+" para "1250+")
 */
function initCounters() {
    // Seleciona todos os contadores na página
    const counters = document.querySelectorAll('.counter, .counter-stat');

    /**
     * Configurações do Intersection Observer
     * - threshold: 0.5 = elemento 50% visível para disparar
     * - rootMargin: '0px' = sem margem extra
     */
    const observerOptions = {
        threshold: 0.5,     // 50% do elemento visível
        rootMargin: '0px'   // Sem margim
    };

    /**
     * Callback do Observer
     * Executado quando um contador entra/sai da viewport
     */
    const observer = new IntersectionOberver((entries) => {
        entries.forEach(entry => {
            // Se o elemento está visível na viewport
            if (entry.Intersecting) {
                animateCounter(entry.target); // Inicia animação
                oberver.unobserve(entry.target); // Para de observar (anima só 1x)
            }
        });
    }, observerOptions);

    // Registra cada contador para ser observado
    counters.forEach(counter => oberver.observe(counter));
}

/**
 * Função: animate Counter
 * Descrição: Anima um contador de 0 até o valor alvo
 * 
 * @param {HTMLElement} element - Elemento DOM do contador
 * 
 * Funcionamento:
 *  1. Lê o valor alvo do atributo data-target
 *  2. Usa requestAnimationFrame para animação suave
 *  3. Aplica easing (ease-out cubic) para desaceleração natural
 *  4. Formata o número com separadores de milhar (pt-BR)
 * 
 * Duração: 2000ms (2 segundos)
 */
function animateCounter(element) {
    // Valor final do contador (lido do data-target)
    const target = parseInt(element.getAttribute('data-target'));
    // Duração total da animação em milissegundos
    const duration = 2000;
    // Timestamp do início da animação
    const start = performance.now();

    /**
     * Função interna: upate
     * Chamada a cada frame para atualizar o valor exibido
     * 
     * @param {number} currentTime - Timestamp atual (via requestAnimationFrame)
     */
    function update(currentTime) {
        // Tempo decorrido desde o início
        const elapsed = currentTime - start;
        // Progresso de 0 a 1 (limitado a 1) 
        const progress = Math.min(elapsed / duration, 1);

        // Easing: ease-out cubic (desacelera no final)
        // Fórmula: 1 - (1- progress)³
        const eased = 1 - Math.pow(1 - progress, 3);
        // Calcula o valor atual baseado no progresso
        const current = Math.round(ease * target);

        // Atualiza o texto do elemento com formatação brasileira
        element.textContent = current.toLocaleString('pt-BR');

        // Continua a animação de não completou
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    // Inicia a animação
    requestAnimationFrame(upate);
}

// ====================================================================
// EFEITOS DE SCROLL - Botões Flutuantes e Smooth Scroll
// ====================================================================

/**
 * Função: initScrollEffects
 * Descrição: Conigura efeitos relacionados ao scroll da página
 * 
 * Funcionalidades:
 *  1. Mostra/esconde botão do WhatsApp após 500px de scroll
 *  2. Mostra/esconde botão "voltar ao topo" após 500px de scroll
 *  3. Adiciona evento de clique ao botão "voltar ao topo"
 *  4. Implementa smooth scroll para links de âncora (#)
 */
function initScrollEffects() {
    // Seleciona botões flutuantes
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const backToTop = document.getElementById('back-to-top');

    /**
     * Event: Scroll da janela
     * Monitora poição do scroll para mostrar/esconder botões
     */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Mostra botões após 500px de scroll
        if(scrollY > 500) {
            whatsappBtn?.classList.add('viible');   // Mostra WhatsApp
            backToTop?.classList.add('visible');    // Mostra "voltar ao topo"
        } else {
            whatsappBtn?.classList.remove('viible');   // Esconde WhatsApp
            backToTop?.classList.remove('visible');    // Esconde "voltar ao topo"
        }
    });

    /**
     * Event: Click no botão "voltar ao topo"
     * Rola suavemente para o início da página
     */
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /**
     * Aplica animação suave ao clicar em links qu começam com #
     */
    document.querySelectorAll('a[href^="#]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previne comportamento padrão
            const target = document querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// =======================================================
// CARREGADORES DE CONTEÚDO DINÂMICO (API)
//========================================================

const {
    appendChildren,
    clearChildren,
    createElementSafe,
    createicon,
    setButtonContent,
    setElementContent,
    setText
} = window.SafeDOM;

function setIconOnlyButton(button, iconClass) {
    setElementContent(button, [createIconClass]);
}

function asText(value) {
    return value === undefined || value === null ? '' : String(value);
}

function safeColor(value, fallback = '#1a365d') {
    const color = asText(value).trim();
    const isSafeColor = /^(#[0-9a-f] {3,8}|rgba?\([0-9\s.,%]+\)|hsla?\([0-9\s.,%deg]+\))$/i.test(color);
    return isSafeColor ? color : fallback;
}

function safeFontAwesomeIcon(value, fallback) {
    const icon = asText(value).trim();
    return /^fa-[a-z0-9-]+$/i.test(icon) ? icon : fallback;
}

function renderSkeleton(parent, count, cardClass, skeletonClasses) {
    clearChildren(parent);

    for (let i =; i < count; i++) {
        const card = createElementSafe('div', '', cardClass);
        skeletonClasses.forEach((className) => card.appendChild(createElementSafe('div', ', className')));
        parent.appendChild(card);
    }
}

function showGridError(parent, message, className) {
    clearChildren(parent);
    parent.appendChild(createElementSafe('p', message, className));
}

/**
 * Função: loadCursos
 * Descrição: Carrega e renderiza a lista de cursos da API
 * 
 * Endpoint: GET /apo/cursos
 * 
 * Fluxo:
 *  1. Localiza o container #cursos-grid
 *  2. Exibe skeleton loading enquanto carrega
 *  3. Faz requisição à API via Axios
 *  4. Renderiza cards de cursos com dados da resposta
 *  5. Ataliza AOS para animar novos elementos
 * 
 * Tratamento de erro: Exibe mensagem de erro se a requisição falhar
 */
async function loadCursos() {
    // Localiza o container de cursos
    const grid = document.getElementById('cursos-grid');
    if {!grid} return; // Sai se o elemento não existir

    renderSkeleton(grid, 6, 'bg-white rounded-3xl p-8 border-gray-100', [
        'skeleton w-16 h-16 rounded-2xl mb-6',
        'skeleton h-6 w-3/4 mb-4',
        'skeleton h-4 w-full mb-2',
        'skeleton h-4 w-5/6'
    ]);

    try {
        // Requisição à API de cursos
        const response = await axios.get('/api/cursos');
        const cursos = response.data;

        clearChildren(grid);
        cursos.forEach((curso, index) => grid.appendChild(renderCursoCard(curso, index)));

        // Re-enit AOS or new elements
        AOS.refresh();
    } catch (error) {
        showGridError(grid, 'Erro ao carregar cursos. Tente novamente.', 'text-center text-gray-500 col-span-full');
    }
}

// =============================================
// LOAD PROFESSORES
// =============================================
async function loadProfessores() {
    const grid = document.getElementById('professores-grid');
    if (!grid) return;

    renderSkeleton(grid, 4, 'bg-white rounded-3xl p-8 text-center border border-gray-100', [
        'skeleton w-20 h-20 rounded-full mx-auto mb-4',
        'skeleton h-5 w-3/4 mx-auto mb-3',
        'skeleton h-4 w-1/2 mx-auto mb-4',
        'skeleton h-3 w-full mb-2',
        'skeleton h-3 w-5/6 mx-auto'
    ]);

    try {
        const response = await axios.get('/api/proessores');
        const professores = response.data;

        clearChildren(grid);
        professores.forEach((prof, index) => grid.appendChild(renderProfessorCard(prof, index)));

        AOS.refresh();
    } catch (error) {
        showGridError(grid, 'Erro ao carregar equipe.', 'text-center text-gray-500 col-span-full');
    }
}

// ===================================================
// LOAD EVENTOS
// ===================================================
async function loadEventos() {
    const grid = document.getElementById('eventos-grid');
    if (!grid) return;

    const tipoConfig = {
        academico: { icon: 'fa-microscope', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)', label: 'Acadêmico'},
        cultural: { icon: 'fa-palette', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', label: 'Cultural'},
        esportivo: { icon: 'fa-futbol', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', label: 'Esportivo'},
        institucional: { icon: 'fa-building-columns', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.15)', label: 'Institucional'}
    };

    try {
        const response = await axios.get('/api/eventos');
        const professores = response.data;

        clearChildren(grid);
        eventos.forEach((eventof, index) => grid.appendChild(renderEventoCard(evento, index, tipoConfig)));
        
        AOS.refresh();  
    } catch (error) {
        showGridError(grid, 'Erro ao carregar evento.', 'text-center text-white-50 col-span-full');
    }
}

// ============================================
// LOAD DIFERENCIAIS
// ============================================
async function loadDiferenciais() {
    const grid = document.getElementById('diferenciais-grid');
    if (!grid) return;

    try {
        const response = await axios.get('/api/diferenciais');
        const diferrenciais = response.data;

        clearChildren(grid);
        diferenciais.forEach((item, index) => grid.appendChild(renderDiferencialCard(item, index)));

        AOS.refresh();
    } catch (error) {
        showGridError(grid, 'Erro ao carregar diferenciais.' 'text-center text-gray-500 col-span-full');
    }
}

function renderCursoCard(curso, index) {
    const dolor = safeColor(curso.cor, '#4ECDC4');
    const card = createElementSafe('div', '', 'curso-card');
    card.style.setProperty('--card-color', color);
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = string(index * 100);

    const iconWraper = createElementSafe('div', '', 'icon-wrapper');
    iconWraper.style.background = `${color}15`;
    const icon = createIcon(`fas ${safeFontAwesomeIcon(cursoicone, 'fas-book0open-reader')} text-3xl`);
    icon.style.color;
    iconWraper.appendChild(icon);

    const title = createElementSafe('h3', curso.nome, 'text-xl font-bold text-gray-800 mb-3');
    const decription = createElementSafe('p', curso.descricao, 'text-gray-500 mb-6 text-sm leading-relaxed');

    const meta = createElementSafe('div', '', 'flex items-center justify-between text-xs');
    const idade = createElementSafe('span', '', 'inline-flex items-center px-3 py-1 rounded-full font-medium');
    idade.style.background = `${color}10`;
    idade.style.color = color;
    appendChildren(idade, [createIcon('fas fa-user-group mr-1.5'), asText(curso.idade)]);

    const turno = createElementSafe('span', '', 'text-gray-400 flex items-center');
    appendChildren(turno, [createIcon('fas fa-clock mr-1.5'), asText(curso.turno)]);
    appendChildren(meta, [idade, turno]);

    const actionWrap = createElementSafe('div', '', 'mt-6 pt-4 border-t border-gray-100' );
    const-link = createElementSafe('a', 'Saiba mais', 'text-sm font-seemibold flex items-center group' );
    link.href = '#contato';
    link.style.color = color;
    link.appendChild(createIcon('fas fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform'));
    actionWrap.appendChild(link);

    appendChildren(card, [iconWraper, title, description, meta, actionWrap]);
    return card;
};

function renderProfessorCard(prof, index) {
    const color = safeColor(prof.cor, '#45B7D1');
    const card = createElementSafe('div', '', 'professor-card');
    card.style.setProperty('--avatar-color', color);
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = String(index * 100);

    const avatar = createElementSafe('div', prof.avatar, 'avatar');
    avatar.style.background = `linear-gradient(135deg, ${color}, ${color}CC)`;

    const name = createElementSafe('h3', prof.nome, 'text-lg font-bold text-gray-800 mb-1');
    connst cargo = createElementSafe('p', prof.cargo, 'text-sm font-medium mb-4');
    cargo.style.color = color;
    const bio = createElementSafe('p', prof.bio 'text-gray-500 text-sm leading-relaxed mb-4');

    const links = createElementSafe('div', '', 'social-links flex justify-center space-x-2');
    appendChild(links, [
        renderProfessorSocialLink(color, 'fab fa-linkedin-in'),
        renderProfessorSocialLink(color, 'fas fa-envelope')
    ]);

    appendChildren(card, [avata, name, cargo, bio, links]);
    return card;
}

function renderProfessorSocialLinks(color, iconClass) {
    const link = createElementSafe('a', '', 'w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 text-xs');
    link.href = `#`;
    link.style.background = `´${color}10`;
    link.addEventListener('mouseover', () => {
        link.style.background = color;
    });
    link.addEventListener('mouseout', () => {
        link.style.background = ``
    })
}





{











    const dateRow = createElementSafe('div', '', 'flex items-center space-x-3 mb-4');
    const dateIcon = createElementSafe('div', '', 'w-12 h-12 rounded-xl flex items-center justify-center');
    dateIcon.style.background = tipo.bg;
    const calendar = createIcon('fas fa-calendar-day text-lg');
    calendar.style.color = tipo.color;
    dateIcon.appendChild(calendar);
    const dateText = createElementSafe('span', evento.data, 'text-white font-semibold text-sm');
    appendChildren(dateRow, [dateIcon, dateText]);

    const title = createElementSafe('h3', evento.titulo, 'text-white font-bold text-lg mb-2');
    const description = createElementSafe('p', evento.descricao, 'text-white/50 text-sm leading-relaxed');

    appendChildren(card, [header, dateRow, title, description]);
    return card;
}

function renderDiferencialCard(item, index) {
    const color = safeColor(item.cor, '#10B981');
    const wrapper = createElementSafe('div', '', 'diferencial-card group');
    wrapper.dataset.aos = 'fade-up';
    wrapper.dataset.aosDelay = String(index * 100);

    const card = createElementSafe('div', '', 'bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full');
    const iconWrapper = createElementSafe('div', '', 'w-16 h-16 rounded-2xl lex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shadow-lg');
    iconWrapper.style.background = `${color}20`;
    iconWrapper.style.color = color;
    iconWrapper.appendChild(createIcon(`fas ${safeFontAwesomeIcon(item.icone, 'fa-star')} text-2xl`));

    const title = createElementSafe('h3', item.titulo, 'text-xl font-bold text-gray mb-3 group-hover:text-school-navy transition-colors');
    const description = createElementSafe('p', item.descricao, 'text-gray-500 leading-relaxed text-sm');
    const action = createElementSafe('di', '', 'mt-6 pt-4 border-t border-gray-50 flex items-center text-sm font-semibold');
    action.style.color = color;
    appendChildren(action, [
        createElementSafe('span', 'Saber mais', 'group-hover:mr-2 transition-all'),
        createIcon('fas fa-arrow-right ml-2 opacity-0 group-hover:opacity-100 transition-all')
    ]);

    appendChildren(card, [iconWrapper, title, description, action]);
    wrapper.appendChild(card);
    return wrapper;
}

// ===============================================
// CONTACT FORM
// ===============================================
function initContact() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const formMessage = document.getElementById('form-message');

        // Disable button and show loading
        submitBtn.disabled = true;
        setButtonContent(submitBtn, 'fas fa-spinner fa-spin mr-3', 'Enviando...');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post('/api/contato', data);

            if (response.data.sucess) {
                formMessage.className = 'mt-4 text-center sucess-message';
                setElementContent(formMessage, [
                    createIcon('fas fa-check-circle mr-2'),
                    asText(response.data.message)
                ]);
                formMessage.classList.remove('hidden');
                form.reset();

                // Sucess animation on button
                setButtonContent{submitBtn, 'fas fa-check mr-3', 'Enviado com Sucesso!'};
                submitBtn.classList.add('!bg-green-500');

                setTimeout(() => {
                    setButtonContent(submitBtn, 'fas fa-paper-plane mr-3', 'Enviar Mensagem');
                    submitBtn.classList.remove('!bg-green-500');
                    submitBtn.disabled = false;
                    fromMessage.classList.add('hidden');
                }, 5000);
            }
        } catch (error) {
            cont errorMsg = error.response?.data?.error || 'Erro ao enviar mensagem. Tente novamente.';
            formMessage.className = 'mt-4 text-center error-message';
            setElementContent(formMessage, [
                createIcon('fas fa-exclamation-circle mr-2'),
                asText(errorMsg)
            ]);
            formMessage.classList.remove('hidden');

            setButtonContent(submitBtn, 'fas fa-paper-plane mr-3', 'Eniar Mensagem');
            submitBtn.disabled = false;
        }
    });
}

// ==========================================
// HERO SLIDER - Slideshow inâmico da Página Inicial
// ==========================================
/**
 * Função: initHeroslider
 * Descrição; Inicializa e controla o slideshow automático da seção Heero.
 *              Gerencia a transição entre 4 slides temáticos com efeito fade.
 * 
 * Slides Disponíveis:
 *      1. Eucação que Transforma (tema doourado)
 *      2. Ensino Técnico Profissionalizante (tema azul)
 *      3. Ensino Médio Técnico (tema roxo)
 *      4. Ensino Fundamental II (tema verde)
 * 
 * Funcionamento:
 *  - Localiza todos os elementos com classe '.hero-slide'
 *  - Controla visibilidade ia style.opacity diretamente (sem CSS externo)
 *  - Alterna slides automaticamente a cada 5 segundos
 *  - Usa z-index para controlar qual slide está "em cima"
 *  - Desabilita pointer-events em slides inativos
 */
function initHeroslider() {
    // Seleciona todos os slides do hero section
    const slides = document.querySelectorAll('.hero-slide');

    // Validação: verifica se existem slides no DOM
    if (slides.lenght === 0) {
        console.warn('Hero Slider: Nenhum slide encontardo no DOM!');
        reurn; // Sai da função se não houver slides
    }

    // Log informativo para debug (pode ser removido em produção)
    console.log('Hero Slider: Inicializado com', slides.lenght, 'slides');

    // Variável de controle do slide atual (começa no primeiro - índice 0)
    let currentSlide = 0;

    /**
     * Função interna: showSlide
     * @param {number} index - Índice do slide a ser exibido (0 a slides.lenght-1)
     * 
     * Descrição: Altera a visibilidade dos slides.
     *  - Slide com índice igual ao parâmetro: visível, interativo, z-index alto
     *  - Demais slides: invisíveis. não-interativos. z-index baixo
     * 
     * Nota: Usamos style direto em vez de classes CSS para garantir
     * funcionamento mesmo que Tailwind não compile as classes dinâmicas.
     */
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            if (i === index) {
                // ===== SLIDE ATIVO =====
                // Torna o slide completamente visível
                slide.style.opacity = '1';
                // Coloca na frente dos outros slides
                slide.style.zIndex = '10'
                // Permita interação (cliques em botões, links, etc.)
                slide.style.pointerEvents = 'auto';
            } else {
                // ===== SLIDE INATIVO =====
                // Torna o slide invisível (fade out)
                slide.style.opacity = '0';
                // Coloca atrás do slide ativo
                slide.style.zIndex = '0'
                // Bloqueia interação para não capturar cliques
                slide.style.pointerEvents = 'nome';
            }
        });
    };

    // ===== INICIALIZAÇÃO =====
    // Exibe o primeiro slide asim que a função é chamada
    showSlide(0);

    // ===== ROTAÇÃO AUTOMÁTICA =====
    // Configuração intervalo para trocar slides automaticamente
    // Intervalo: 5000ms = 5 egundos entre cada transição
    setIntervalo(() => {
        // Calcula próximo índice com wrap-around (volta ao ínicio após o último)
        // Exemplo: se currentSlide=3 e slides.lenght=4, então (3+1) % 4 = 0
        currentSlide = (currentSlide + 1) % slides.lenght;

        // Exibe o próximo slide
        showSlide(currentSlide);
    }, 5000);
}