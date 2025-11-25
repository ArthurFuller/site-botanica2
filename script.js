// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navToggle) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Skip external links
            if (targetId.includes('.html')) {
                window.location.href = targetId;
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Initial call
    updateActiveNav();

    // Back to top button
    function createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Voltar ao topo');
        backToTop.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(backToTop);

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
    }

    createBackToTopButton();

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        }
        
        // Update icon based on current theme
        updateThemeIcon(currentTheme);
        
        function updateThemeIcon(theme) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeToggle.title = 'Alternar para modo claro';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeToggle.title = 'Alternar para modo escuro';
            }
        }
        
        // Theme toggle event listener
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            if (newTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
            }
            
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add a subtle animation
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            clearHighlights();
            return;
        }
        
        clearHighlights();
        
        const sections = document.querySelectorAll('.section');
        let foundResults = false;
        let firstResult = null;
        
        sections.forEach(section => {
            const textContent = section.textContent.toLowerCase();
            if (textContent.includes(searchTerm)) {
                if (!foundResults) {
                    firstResult = section;
                    foundResults = true;
                }
                highlightSection(section);
            }
        });
        
        if (foundResults && firstResult) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = firstResult.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            showNoResultsMessage();
        }
    }
    
    function clearHighlights() {
        const highlightedSections = document.querySelectorAll('.section.search-highlight');
        highlightedSections.forEach(section => {
            section.classList.remove('search-highlight');
        });
        
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    function highlightSection(section) {
        section.classList.add('search-highlight');
    }
    
    function showNoResultsMessage() {
        const heroSection = document.querySelector('.hero');
        const noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 1rem; margin: 1rem 0; text-align: center; color: #856404;">
                <i class="fas fa-search"></i> Nenhum resultado encontrado para "${searchInput.value}"
            </div>
        `;
        heroSection.insertAdjacentElement('afterend', noResultsMsg);
        
        setTimeout(() => {
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }, 3000);
    }
    
    // Search event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                clearHighlights();
            }
        });
    }

    // Quiz functionality - BOTÂNICA
    const quizData = {
        simulado: [
            {
                category: "Fungos - Características",
                question: "Qual é a composição da parede celular dos fungos?",
                options: ["Celulose", "Quitina", "Peptideoglicano", "Lignina"],
                correct: 1,
                explanation: "A parede celular dos fungos é composta por quitina, característica compartilhada com artrópodes, diferente das plantas que possuem celulose.",
                link: "#fungos"
            },
            {
                category: "Fungos - Nutrição",
                question: "Como os fungos obtêm seus nutrientes?",
                options: ["Fotossíntese", "Quimiossíntese", "Absorção", "Ingestão"],
                correct: 2,
                explanation: "Os fungos são heterotróficos e obtêm nutrientes por absorção, entrando em contato direto com o substrato através das hifas.",
                link: "#fungos"
            },
            {
                category: "Micorrizas",
                question: "Qual porcentagem das plantas vasculares dependem de micorrizas?",
                options: ["50%", "60%", "80%", "90%"],
                correct: 2,
                explanation: "Cerca de 80% das plantas vasculares dependem de associações micorrízicas para aumentar a absorção de água e minerais.",
                link: "#simbioticas"
            },
            {
                category: "Liquens",
                question: "Qual é o componente fotossintetizante dos liquens?",
                options: ["Micobionte", "Fotobionte", "Micélio", "Hifas"],
                correct: 1,
                explanation: "O fotobionte (alga verde ou cianobactéria) é o componente que realiza fotossíntese nos liquens, enquanto o micobionte é o fungo.",
                link: "#liquens"
            },
            {
                category: "Liquens - Tipos de Talo",
                question: "Quantos tipos principais de talo existem em liquens?",
                options: ["2 tipos", "3 tipos", "4 tipos", "5 tipos"],
                correct: 2,
                explanation: "Existem 4 tipos principais de talo em liquens: filamentoso, crostoso, folioso e fruticoso.",
                link: "#liquens"
            },
            {
                category: "Fungos - Recordes",
                question: "Qual é o maior organismo vivo do planeta?",
                options: ["Sequoia gigante", "Armillaria ostoyae", "Baleia azul", "Grande Barreira de Corais"],
                correct: 1,
                explanation: "Armillaria ostoyae é o maior organismo vivo, ocupando mais de 600 hectares no Oregon, EUA, com idade entre 400-1.000 anos.",
                link: "#fungos"
            },
            {
                category: "Fungos - Ecologia",
                question: "Quantas espécies de fungos são patogênicas para humanos?",
                options: ["Mais de 50", "Mais de 100", "Mais de 200", "Mais de 500"],
                correct: 2,
                explanation: "Mais de 200 espécies de fungos são patogênicas para seres humanos, causando diversas doenças.",
                link: "#fungos"
            },
            {
                category: "Samambaias - Características",
                question: "Qual estrutura caracteriza as plantas vasculares?",
                options: ["Flores e frutos", "Xilema e floema", "Raízes e caules", "Sementes"],
                correct: 1,
                explanation: "Plantas vasculares possuem xilema e floema, tecidos condutores de seiva que permitem maior porte e adaptação a ambientes terrestres.",
                link: "#samambaias"
            },
            {
                category: "Samambaias - Reprodução",
                question: "O que é necessário para a fecundação em samambaias?",
                options: ["Vento", "Água", "Insetos polinizadores", "Gravidade"],
                correct: 1,
                explanation: "A fecundação em samambaias requer água, pois os anterozoides são móveis e flagelados, nadando até a oosfera.",
                link: "#samambaias"
            },
            {
                category: "Samambaias - Famílias",
                question: "Qual família de samambaias NÃO possui indúsio?",
                options: ["Pteridaceae", "Polypodiaceae", "Tectariaceae", "Aspleniaceae"],
                correct: 1,
                explanation: "A família Polypodiaceae é caracterizada pela ausência de indúsio nos soros, uma característica distintiva importante.",
                link: "#samambaias"
            },
            {
                category: "Samambaias - Morfologia",
                question: "Qual família possui soros em forma de bolsa ou copo?",
                options: ["Anemiaceae", "Saccolomataceae", "Blechnaceae", "Cyatheaceae"],
                correct: 1,
                explanation: "A família Saccolomataceae possui indúsio característico em forma de bolsa ou copo.",
                link: "#samambaias"
            },
            {
                category: "Licófitas",
                question: "Como são chamadas as folhas das licófitas?",
                options: ["Macrófilos", "Microfilos", "Frondes", "Pinas"],
                correct: 1,
                explanation: "As licófitas possuem microfilos, folhas simples com uma única nervura, diferente dos macrófilos das samambaias.",
                link: "#licofitas"
            },
            {
                category: "Fungos - Estrutura",
                question: "Como é chamado o conjunto de hifas?",
                options: ["Micélio", "Esporo", "Himênio", "Píleo"],
                correct: 0,
                explanation: "O micélio é o conjunto de hifas que forma o corpo vegetativo do fungo, responsável pelo crescimento e absorção de nutrientes.",
                link: "#morfologia"
            },
            {
                category: "Morfologia - Cogumelos",
                question: "Qual estrutura do cogumelo é responsável pela produção de esporos?",
                options: ["Píleo", "Himênio", "Estipe", "Anel"],
                correct: 1,
                explanation: "O himênio é a parte fértil do cogumelo onde os esporos são produzidos, localizado na parte inferior do píleo.",
                link: "#morfologia"
            },
            {
                category: "Grupos de Fungos",
                question: "Qual filo de fungos é o mais abundante?",
                options: ["Basidiomycota", "Ascomycota", "Zygomycota", "Glomeromycota"],
                correct: 1,
                explanation: "Ascomycota é o grupo mais abundante de fungos, incluindo leveduras e a maioria dos fungos liquenizados.",
                link: "#morfologia"
            },
            {
                category: "Liquens - Substratos",
                question: "Como são chamados os liquens que crescem sobre rochas?",
                options: ["Corticícolas", "Terrícolas", "Saxícolas", "Foliícolas"],
                correct: 2,
                explanation: "Saxícolas são liquens que crescem sobre rochas (saxon = rocha), sendo pioneiros na colonização de substratos rochosos.",
                link: "#liquens"
            },
            {
                category: "Reprodução - Fungos",
                question: "Qual é o processo de fusão de núcleos na reprodução sexuada dos fungos?",
                options: ["Plasmogamia", "Cariogamia", "Meiose", "Mitose"],
                correct: 1,
                explanation: "Cariogamia é o processo de fusão de núcleos na reprodução sexuada dos fungos, resultando em variabilidade genética.",
                link: "#reproducao"
            },
            {
                category: "Samambaias - Ciclo",
                question: "Qual é a fase dominante no ciclo de vida das samambaias?",
                options: ["Gametófito", "Esporófito", "Prótalo", "Esporo"],
                correct: 1,
                explanation: "O esporófito é a fase dominante nas samambaias, sendo grande, fotossintetizante e de vida longa.",
                link: "#samambaias"
            },
            {
                category: "Fungos - Tolerância",
                question: "Qual é a faixa de temperatura que alguns fungos toleram?",
                options: ["0°C a 40°C", "-5°C a 50°C", "-10°C a 60°C", "-20°C a 70°C"],
                correct: 2,
                explanation: "Alguns fungos como Cladosporium herbarum e Chaetomium sp. podem viver em temperaturas extremas de -10°C a 60°C.",
                link: "#fungos"
            },
            {
                category: "Samambaias - Famílias",
                question: "Qual família de samambaias forma troncos (arborescentes)?",
                options: ["Polypodiaceae", "Pteridaceae", "Cyatheaceae", "Anemiaceae"],
                correct: 2,
                explanation: "A família Cyatheaceae inclui as samambaias arborescentes que formam troncos verdadeiros e podem atingir vários metros de altura.",
                link: "#samambaias"
            }
        ],
        basico: [
            {
                category: "Fungos - Definição",
                question: "Os fungos realizam fotossíntese?",
                options: ["Apenas em ambientes escuros", "Não, são heterotróficos", "Sim, como as plantas", "Apenas alguns grupos"],
                correct: 1,
                explanation: "Os fungos não realizam fotossíntese pois não possuem clorofila. São organismos heterotróficos que obtêm nutrientes por absorção.",
                link: "#fungos"
            },
            {
                category: "Fungos - Estrutura",
                question: "Como são chamadas as estruturas filamentosas dos fungos?",
                options: ["Esporos", "Píleo", "Hifas", "Micélio"],
                correct: 2,
                explanation: "Hifas são as estruturas filamentosas que formam o corpo do fungo. O conjunto de hifas é chamado de micélio.",
                link: "#fungos"
            },
            {
                category: "Micorrizas",
                question: "O que são micorrizas?",
                options: [
                    "Esporos de fungos",
                    "Tipo de líquen",
                    "Fungos parasitas",
                    "Associação entre fungos e raízes de plantas"
                ],
                correct: 3,
                explanation: "Micorrizas são associações mutualísticas entre fungos e raízes de plantas, onde ambos se beneficiam da relação.",
                link: "#simbioticas"
            },
            {
                category: "Samambaias",
                question: "As samambaias possuem sementes?",
                options: ["Não, reproduzem-se por esporos", "Apenas as aquáticas", "Sim, como todas as plantas", "Apenas as arborescentes"],
                correct: 0,
                explanation: "Samambaias são plantas vasculares sem sementes que se reproduzem por esporos, representando um grupo evolutivo anterior às plantas com sementes.",
                link: "#samambaias"
            },
            {
                category: "Liquens",
                question: "O que são liquens?",
                options: [
                    "Um tipo de samambaia",
                    "Associação entre fungo e alga",
                    "Um tipo de fungo",
                    "Um tipo de alga"
                ],
                correct: 1,
                explanation: "Liquens são associações simbióticas entre fungos (micobionte) e algas ou cianobactérias (fotobionte).",
                link: "#liquens"
            }
        ],
        intermediario: [
            {
                category: "Fungos - Parede Celular",
                question: "Qual substância compõe a parede celular dos fungos?",
                options: ["Lignina", "Peptideoglicano", "Quitina", "Celulose"],
                correct: 2,
                explanation: "A parede celular dos fungos é composta por quitina, mesma substância encontrada no exoesqueleto de artrópodes.",
                link: "#fungos"
            },
            {
                category: "Micorrizas - Benefícios",
                question: "Qual é o principal benefício das micorrizas para as plantas?",
                options: [
                    "Aumento da absorção de água e minerais",
                    "Resistência a doenças",
                    "Proteção contra herbívoros",
                    "Produção de flores"
                ],
                correct: 0,
                explanation: "As micorrizas aumentam significativamente a absorção de água e minerais pelas plantas, enquanto os fungos recebem açúcares.",
                link: "#simbioticas"
            },
            {
                category: "Liquens - Componentes",
                question: "Qual porcentagem dos liquens possui fungos do filo Ascomycota?",
                options: ["100%", "50%", "75%", "98%"],
                correct: 3,
                explanation: "98% dos liquens possuem fungos do filo Ascomycota como micobionte, enquanto apenas 2% são Basidiomycota.",
                link: "#liquens"
            },
            {
                category: "Samambaias - Indúsio",
                question: "O que é o indúsio nas samambaias?",
                options: [
                    "Folha modificada",
                    "Estrutura que protege os soros",
                    "Raiz adventícia",
                    "Tipo de esporo"
                ],
                correct: 1,
                explanation: "O indúsio é uma estrutura que protege os soros (agrupamentos de esporângios) em muitas famílias de samambaias.",
                link: "#samambaias"
            },
            {
                category: "Fungos - Modos de Vida",
                question: "Qual é o modo de vida de fungos que decompõem matéria orgânica morta?",
                options: ["Endófitos", "Micorrízicos", "Saprófitos", "Parasitas"],
                correct: 2,
                explanation: "Saprófitos são fungos que decompõem matéria orgânica morta, reciclando nutrientes essenciais para o solo.",
                link: "#fungos"
            }
        ],
        avancado: [
            {
                category: "Fungos - Estrutura Celular",
                question: "O que são fungos cenocíticos?",
                options: [
                    "Fungos com parede celular dupla",
                    "Fungos unicelulares",
                    "Fungos com células septadas",
                    "Fungos asseptados com citoplasma em comum"
                ],
                correct: 3,
                explanation: "Fungos cenocíticos são asseptados, ou seja, não possuem septos, tendo citoplasma em comum e sendo multinucleados.",
                link: "#morfologia"
            },
            {
                category: "Basidiomycota",
                question: "Qual é a característica distintiva das células de Basidiomycota?",
                options: [
                    "Septos com dolíporo",
                    "Núcleo duplo",
                    "Parede celular de celulose",
                    "Ausência de septos"
                ],
                correct: 0,
                explanation: "Basidiomycota possui células septadas com dolíporo, um tipo especial de septo que caracteriza este filo.",
                link: "#morfologia"
            },
            {
                category: "Liquens - Reprodução",
                question: "Como os liquens se reproduzem assexuadamente?",
                options: [
                    "Por brotamento",
                    "Por sorédios",
                    "Por esporos",
                    "Por fragmentação"
                ],
                correct: 1,
                explanation: "Liquens se reproduzem assexuadamente pela formação de sorédios, propágulos vegetativos que contêm células de alga e hifas de fungo.",
                link: "#liquens"
            },
            {
                category: "Samambaias - Ciclo",
                question: "Como é chamado o gametófito das samambaias?",
                options: ["Indúsio", "Soro", "Prótalo", "Esporângio"],
                correct: 2,
                explanation: "O prótalo é o gametófito das samambaias, uma estrutura pequena e de vida curta que produz gametas.",
                link: "#samambaias"
            },
            {
                category: "Licófitas - Morfologia",
                question: "Onde estão localizados os esporângios nas licófitas?",
                options: [
                    "No caule",
                    "Nas folhas basais",
                    "Nas raízes",
                    "Em estróbilos (espigas terminais)"
                ],
                correct: 3,
                explanation: "Os esporângios das licófitas estão localizados em estróbilos, que são cones ou espigas reprodutivas terminais.",
                link: "#licofitas"
            }
        ]
    };

    let currentQuiz = [];
    let currentQuestion = 0;
    let score = 0;
    let selectedLevel = '';
    let userAnswers = [];

    // Quiz elements
    const quizStart = document.getElementById('quizStart');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizResults = document.getElementById('quizResults');
    const levelButtons = document.querySelectorAll('.level-btn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const questionCategory = document.getElementById('questionCategory');
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    const questionFeedback = document.getElementById('questionFeedback');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackExplanation = document.getElementById('feedbackExplanation');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    const reviewBtn = document.getElementById('reviewBtn');

    // Start quiz (incluindo simulado)
    if (levelButtons.length > 0) {
        levelButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                selectedLevel = this.dataset.level;
                startQuiz();
            });
        });
    }

    function startQuiz() {
        currentQuiz = [...quizData[selectedLevel]];
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        
        // Hide both quiz and simulado start screens
        if (quizStart) quizStart.style.display = 'none';
        const simuladoSection = document.querySelector('#simulado .hero');
        if (simuladoSection && selectedLevel === 'simulado') {
            simuladoSection.style.display = 'none';
        }
        
        // Show question screen
        if (quizQuestion) quizQuestion.style.display = 'block';
        
        // Scroll to quiz section
        const quizSection = document.getElementById('quiz');
        if (quizSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = quizSection.offsetTop - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        showQuestion();
    }

    function showQuestion() {
        if (!currentQuiz[currentQuestion]) return;
        
        const question = currentQuiz[currentQuestion];
        
        // Update progress
        const progress = ((currentQuestion + 1) / currentQuiz.length) * 100;
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = `Questão ${currentQuestion + 1} de ${currentQuiz.length}`;
        
        // Update question content
        if (questionCategory) questionCategory.textContent = question.category;
        if (questionNumber) questionNumber.textContent = currentQuestion + 1;
        if (questionText) questionText.textContent = question.question;
        
        // Update answer options
        if (answerOptions) {
            answerOptions.innerHTML = '';
            question.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'answer-btn';
                btn.dataset.answer = index;
                btn.innerHTML = `
                    <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                    <span class="answer-text">${option}</span>
                `;
                btn.addEventListener('click', selectAnswer);
                answerOptions.appendChild(btn);
            });
        }
        
        // Reset feedback and controls
        if (questionFeedback) questionFeedback.style.display = 'none';
        if (prevBtn) prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    function selectAnswer(e) {
        const selectedBtn = e.currentTarget;
        const selectedAnswer = parseInt(selectedBtn.dataset.answer);
        const question = currentQuiz[currentQuestion];
        const isCorrect = selectedAnswer === question.correct;
        
        // Disable all buttons
        const allBtns = answerOptions.querySelectorAll('.answer-btn');
        allBtns.forEach(btn => {
            btn.style.pointerEvents = 'none';
            const answerIndex = parseInt(btn.dataset.answer);
            
            if (answerIndex === question.correct) {
                btn.classList.add('correct');
            } else if (answerIndex === selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Store answer
        userAnswers[currentQuestion] = {
            selected: selectedAnswer,
            correct: isCorrect
        };
        
        if (isCorrect) score++;
        
        // Show feedback
        showFeedback(isCorrect, question);
        
        // Show next button
        if (nextBtn) {
            nextBtn.style.display = 'block';
            nextBtn.innerHTML = currentQuestion === currentQuiz.length - 1 ? 
                'Ver Resultados <i class="fas fa-chart-bar"></i>' : 
                'Próxima <i class="fas fa-arrow-right"></i>';
        }
    }

    function showFeedback(isCorrect, question) {
        if (feedbackIcon) {
            feedbackIcon.innerHTML = isCorrect ? 
                '<i class="fas fa-check-circle"></i>' : 
                '<i class="fas fa-times-circle"></i>';
            feedbackIcon.className = isCorrect ? 'feedback-icon correct' : 'feedback-icon incorrect';
        }
        
        if (feedbackTitle) feedbackTitle.textContent = isCorrect ? 'Correto!' : 'Incorreto!';
        if (feedbackExplanation) feedbackExplanation.textContent = question.explanation;
        
        const feedbackLink = questionFeedback?.querySelector('.feedback-link');
        if (feedbackLink) {
            feedbackLink.href = question.link;
        }
        
        if (questionFeedback) questionFeedback.style.display = 'block';
    }

    // Navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentQuestion === currentQuiz.length - 1) {
                showResults();
            } else {
                currentQuestion++;
                showQuestion();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion();
            }
        });
    }

    function showResults() {
        if (quizQuestion) quizQuestion.style.display = 'none';
        if (quizResults) quizResults.style.display = 'block';
        
        const percentage = Math.round((score / currentQuiz.length) * 100);
        const grade = getGrade(percentage);
        
        const finalScore = document.getElementById('finalScore');
        const finalPercentage = document.getElementById('finalPercentage');
        const finalGrade = document.getElementById('finalGrade');
        
        if (finalScore) finalScore.textContent = score;
        if (finalPercentage) finalPercentage.textContent = percentage + '%';
        if (finalGrade) finalGrade.textContent = grade;
        
        // Update results icon and title based on performance
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsSubtitle = document.getElementById('resultsSubtitle');
        
        if (percentage >= 80) {
            if (resultsIcon) resultsIcon.innerHTML = '<i class="fas fa-trophy"></i>';
            if (resultsTitle) resultsTitle.textContent = 'Excelente!';
            if (resultsSubtitle) resultsSubtitle.textContent = 'Você domina o conteúdo sobre botânica';
        } else if (percentage >= 60) {
            if (resultsIcon) resultsIcon.innerHTML = '<i class="fas fa-medal"></i>';
            if (resultsTitle) resultsTitle.textContent = 'Bom trabalho!';
            if (resultsSubtitle) resultsSubtitle.textContent = 'Continue estudando para melhorar';
        } else {
            if (resultsIcon) resultsIcon.innerHTML = '<i class="fas fa-book"></i>';
            if (resultsTitle) resultsTitle.textContent = 'Continue estudando!';
            if (resultsSubtitle) resultsSubtitle.textContent = 'Revise o conteúdo e tente novamente';
        }
        
        // Calculate topic breakdown
        updateTopicBreakdown();
    }

    function getGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }

    function updateTopicBreakdown() {
        const topics = {};
        
        currentQuiz.forEach((question, index) => {
            const category = question.category;
            if (!topics[category]) {
                topics[category] = { correct: 0, total: 0 };
            }
            topics[category].total++;
            if (userAnswers[index] && userAnswers[index].correct) {
                topics[category].correct++;
            }
        });
        
        const topicResults = document.querySelector('.topic-results');
        if (topicResults) {
            topicResults.innerHTML = '';
            
            Object.entries(topics).forEach(([topic, data]) => {
                const percentage = Math.round((data.correct / data.total) * 100);
                const topicDiv = document.createElement('div');
                topicDiv.className = 'topic-result';
                topicDiv.innerHTML = `
                    <span class="topic-name">${topic}</span>
                    <div class="topic-bar">
                        <div class="topic-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="topic-score">${data.correct}/${data.total}</span>
                `;
                topicResults.appendChild(topicDiv);
            });
        }
    }

    // Restart quiz
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            if (quizResults) quizResults.style.display = 'none';
            if (quizStart) quizStart.style.display = 'block';
        });
    }

    // Review content
    if (reviewBtn) {
        reviewBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Add hover effects to cards
    const cards = document.querySelectorAll('.info-card, .characteristic-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add loading animation to sections
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});
