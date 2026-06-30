        // Tailwind script
        function initializeTailwind() {
            document.documentElement.style.setProperty('--accent-green', '#166534');
        }
        
        // Navbar scroll effect
        function initNavbar() {
            const navbar = document.getElementById('navbar');
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 80) {
                    navbar.classList.add('nav-scrolled');
                } else {
                    navbar.classList.remove('nav-scrolled');
                }
            });
            
            // Mobile menu
            const mobileBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileBtn.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            });
            
            // Close mobile menu when clicking links
            document.querySelectorAll('.mobile-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                });
            });
            
            // Smooth scroll for nav
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        const offset = 80;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition - bodyRect - offset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
        
        // Animated counters
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(counter => {
                            const target = parseFloat(counter.getAttribute('data-target'));
                            const isFloat = target % 1 !== 0;
                            
                            let start = 0;
                            const duration = 1600;
                            const increment = target / (duration / 16);
                            
                            const timer = setInterval(() => {
                                start += increment;
                                if (start >= target) {
                                    if (isFloat) {
                                        counter.textContent = target.toFixed(1);
                                    } else {
                                        counter.textContent = Math.floor(target).toLocaleString('pt-BR');
                                    }
                                    clearInterval(timer);
                                } else {
                                    if (isFloat) {
                                        counter.textContent = start.toFixed(1);
                                    } else {
                                        counter.textContent = Math.floor(start).toLocaleString('pt-BR');
                                    }
                                }
                            }, 16);
                        });
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.6 });
            
            const impactSection = document.getElementById('impacto');
            if (impactSection) observer.observe(impactSection);
        }
        
        // ========== COMPARISON SLIDER ==========
        let isDragging = false;
        
        function initComparisonSlider() {
            const container = document.getElementById('comparison-container');
            const after = document.getElementById('comparison-after');
            const handle = document.getElementById('slider-handle');
            
            if (!container || !after || !handle) return;
            
            function updateSlider(percent) {
                percent = Math.max(0, Math.min(100, percent));
                after.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
                handle.style.left = `${percent}%`;
            }
            
            // Mouse events
            handle.addEventListener('mousedown', (e) => {
                isDragging = true;
                document.body.style.userSelect = 'none';
            });
            
            window.addEventListener('mouseup', () => {
                isDragging = false;
                document.body.style.userSelect = '';
            });
            
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const rect = container.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                updateSlider(percent);
            });
            
            // Touch support
            handle.addEventListener('touchstart', () => { isDragging = true; });
            window.addEventListener('touchend', () => { isDragging = false; });
            window.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const rect = container.getBoundingClientRect();
                const percent = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                updateSlider(percent);
            });
            
            // Click anywhere on container
            container.addEventListener('click', (e) => {
                const rect = container.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                updateSlider(percent);
            });
            
            // Keyboard accessibility
            handle.setAttribute('tabindex', '0');
            handle.addEventListener('keydown', (e) => {
                let currentLeft = parseFloat(handle.style.left) || 50;
                if (e.key === 'ArrowLeft') currentLeft -= 5;
                if (e.key === 'ArrowRight') currentLeft += 5;
                updateSlider(currentLeft);
            });
            
            // Initial position
            updateSlider(52);
        }
        
        // ========== QUIZ ==========
        const quizQuestions = [
            {
                question: "Você utiliza o sistema de plantio direto na sua propriedade?",
                options: ["Sim, em toda a área", "Sim, em parte da área", "Não, mas pretendo adotar", "Não utilizo"],
                scores: [5, 3, 1, 0]
            },
            {
                question: "Você pratica rotação de culturas ou consórcio com plantas de cobertura?",
                options: ["Sim, todos os anos", "Às vezes", "Raramente", "Nunca"],
                scores: [5, 3, 1, 0]
            },
            {
                question: "Você já adotou ou está implementando o sistema ILPF (Integração Lavoura-Pecuária-Floresta)?",
                options: ["Sim, em grande escala", "Em fase piloto", "Estou estudando", "Não tenho interesse no momento"],
                scores: [5, 3, 1, 0]
            },
            {
                question: "Como você monitora a saúde do solo da sua fazenda?",
                options: ["Análises regulares + sensores/tecnologia", "Análises periódicas", "Observação visual", "Não monitoro"],
                scores: [5, 3, 1, 0]
            },
            {
                question: "Qual a sua principal fonte de adubação e correção de solo?",
                options: ["Principalmente bioinsumos e adubos orgânicos", "Mistura equilibrada", "Quase só fertilizantes químicos", "Somente fertilizantes químicos"],
                scores: [5, 3, 1, 0]
            },
            {
                question: "Você já calculou ou monitora a emissão de carbono da sua propriedade?",
                options: ["Sim, e já vendo créditos de carbono", "Sim, mas ainda não vendo", "Já medi uma vez", "Nunca medi"],
                scores: [5, 3, 1, 0]
            },
            {
                question: "Como você lida com a biodiversidade na fazenda (corredores ecológicos, preservação de APPs, etc)?",
                options: ["Tenho projeto estruturado e em expansão", "Preservo o mínimo exigido por lei", "Faço o básico", "Não tenho ações específicas"],
                scores: [5, 3, 1, 0]
            }
        ];
        
        let currentQuestion = 0;
        let quizScore = 0;
        let selectedAnswers = [];
        
        function initQuiz() {
            currentQuestion = 0;
            quizScore = 0;
            selectedAnswers = [];
            renderQuestion();
        }
        
        function renderQuestion() {
            const container = document.getElementById('quiz-container');
            const q = quizQuestions[currentQuestion];
            
            let html = `
                <div class="mb-6">
                    <div class="text-emerald-700 text-xs font-extrabold tracking-widest mb-1">PERGUNTA ${currentQuestion + 1} DE ${quizQuestions.length}</div>
                    <h4 class="font-semibold text-xl leading-tight">${q.question}</h4>
                </div>
                <div class="space-y-3" id="quiz-options">
            `;
            
            q.options.forEach((option, index) => {
                html += `
                    <div onclick="selectAnswer(${index})" 
                         class="quiz-option border border-slate-200 hover:border-emerald-300 px-6 py-4 rounded-2xl cursor-pointer flex items-center gap-x-4 text-sm font-medium">
                        <div class="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-mono border-slate-300" id="option-dot-${index}">
                            ${String.fromCharCode(65 + index)}
                        </div>
                        <div class="flex-1">${option}</div>
                    </div>
                `;
            });
            
            html += `</div>`;
            container.innerHTML = html;
            
            // Update progress
            document.getElementById('quiz-progress').innerHTML = `${currentQuestion + 1}/${quizQuestions.length}`;
            
            // Update buttons
            document.getElementById('quiz-prev').disabled = currentQuestion === 0;
            
            const nextBtn = document.getElementById('quiz-next');
            const nextText = document.getElementById('quiz-next-text');
            
            if (currentQuestion === quizQuestions.length - 1) {
                nextText.innerHTML = `Ver resultado <i class="fa-solid fa-check ml-2"></i>`;
            } else {
                nextText.innerHTML = `Próxima pergunta`;
            }
            
            // Restore previous selection if exists
            if (selectedAnswers[currentQuestion] !== undefined) {
                const selectedIndex = selectedAnswers[currentQuestion];
                const optionEl = document.querySelector(`#option-dot-${selectedIndex}`).parentElement;
                if (optionEl) optionEl.classList.add('selected', 'border-emerald-600');
            }
        }
        
        function selectAnswer(optionIndex) {
            // Deselect all
            document.querySelectorAll('#quiz-options > div').forEach(el => el.classList.remove('selected', 'border-emerald-600'));
            
            // Select current
            const optionEl = event.currentTarget || document.querySelectorAll('#quiz-options > div')[optionIndex];
            if (optionEl) {
                optionEl.classList.add('selected', 'border-emerald-600');
            }
            
            selectedAnswers[currentQuestion] = optionIndex;
            
            // Auto advance after short delay (better UX)
            setTimeout(() => {
                if (currentQuestion < quizQuestions.length - 1) {
                    nextQuestion();
                } else {
                    // Last question - show result immediately
                    showQuizResult();
                }
            }, 420);
        }
        
        function nextQuestion() {
            if (selectedAnswers[currentQuestion] === undefined) {
                // If nothing selected, pick neutral
                selectedAnswers[currentQuestion] = 2;
            }
            
            quizScore += quizQuestions[currentQuestion].scores[selectedAnswers[currentQuestion]];
            
            if (currentQuestion < quizQuestions.length - 1) {
                currentQuestion++;
                renderQuestion();
            } else {
                showQuizResult();
            }
        }
        
        function prevQuestion() {
            if (currentQuestion > 0) {
                // Remove previous score
                if (selectedAnswers[currentQuestion - 1] !== undefined) {
                    quizScore -= quizQuestions[currentQuestion - 1].scores[selectedAnswers[currentQuestion - 1]];
                }
                currentQuestion--;
                renderQuestion();
            }
        }
        
        function showQuizResult() {
            const container = document.getElementById('quiz-container');
            const maxScore = quizQuestions.length * 5;
            const percentage = Math.round((quizScore / maxScore) * 100);
            
            let level = '';
            let color = '';
            let message = '';
            let tips = '';
            
            if (percentage >= 85) {
                level = 'Líder Regenerativo';
                color = 'emerald';
                message = 'Você está na vanguarda da agricultura sustentável no Brasil!';
                tips = 'Continue expandindo práticas e considere vender créditos de carbono. Você pode liderar sua região.';
            } else if (percentage >= 65) {
                level = 'Em Transição Avançada';
                color = 'emerald';
                message = 'Você já está no caminho certo e colhendo resultados.';
                tips = 'Foque em expandir as áreas com ILPF e bioinsumos. O próximo passo é o mercado de carbono.';
            } else if (percentage >= 40) {
                level = 'Em Transição';
                color = 'amber';
                message = 'Você já começou a jornada. Está na hora de acelerar.';
                tips = 'Priorize plantio direto + rotação de culturas. Comece pequeno com bioinsumos.';
            } else {
                level = 'Convencional com Potencial';
                color = 'orange';
                message = 'Existe um enorme potencial de transformação na sua fazenda.';
                tips = 'Comece com análise de solo e plantio direto. O retorno costuma aparecer em 2-3 safras.';
            }
            
            container.innerHTML = `
                <div class="text-center py-4">
                    <div class="inline-block px-5 py-1 rounded-3xl bg-${color}-100 text-${color}-700 text-xs font-extrabold tracking-widest mb-4">SEU NÍVEL ATUAL</div>
                    
                    <div class="text-6xl font-black text-${color}-700 tracking-tighter mb-1">${percentage}<span class="text-3xl align-super">%</span></div>
                    <div class="font-extrabold text-3xl tracking-tight">${level}</div>
                    
                    <div class="max-w-xs mx-auto mt-6">
                        <p class="text-lg">${message}</p>
                    </div>
                    
                    <div class="mt-8 bg-slate-50 border border-slate-100 p-6 rounded-2xl text-left">
                        <div class="font-semibold mb-3 text-sm text-emerald-700">PRÓXIMOS PASSOS RECOMENDADOS:</div>
                        <div class="text-sm leading-relaxed">${tips}</div>
                    </div>
                    
                    <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <button onclick="restartQuiz()" class="px-8 py-3 rounded-2xl border text-sm font-semibold flex-1 sm:flex-none">Refazer o Quiz</button>
                        <button onclick="calculateImpactFromQuiz()" class="px-8 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold flex-1 sm:flex-none">Ver meu potencial completo</button>
                    </div>
                </div>
            `;
            
            // Hide next/prev buttons
            document.getElementById('quiz-prev').style.display = 'none';
            document.getElementById('quiz-next').style.display = 'none';
        }
        
        function restartQuiz() {
            document.getElementById('quiz-prev').style.display = 'flex';
            document.getElementById('quiz-next').style.display = 'flex';
            initQuiz();
        }
        
        function calculateImpactFromQuiz() {
            // Scroll to calculator and prefill some values
            document.getElementById('interaja').scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                document.getElementById('sust-range').value = Math.max(35, Math.floor(quizScore / 1.4));
                updateCalculator();
            }, 800);
        }
        
        // ========== CALCULATOR ==========
        function updateCalculator() {
            const area = parseInt(document.getElementById('area-range').value);
            const sust = parseInt(document.getElementById('sust-range').value);
            
            document.getElementById('area-value').innerHTML = area.toLocaleString('pt-BR');
            document.getElementById('sust-value').innerHTML = sust + '%';
            
            // Live update results if already calculated
            const resultsDiv = document.getElementById('calculator-results');
            if (!resultsDiv.classList.contains('hidden')) {
                calculateImpact(true);
            }
        }
        
        function calculateImpact(isLiveUpdate = false) {
            const area = parseInt(document.getElementById('area-range').value);
            const sustPercent = parseInt(document.getElementById('sust-range').value);
            const atividade = document.getElementById('atividade-select').value;
            
            // Realistic calculation model
            let baseProductivityGain = 18; // %
            let carbonSequestration = 2.8; // tCO2e / ha / year (regenerative average)
            
            // Adjust by activity
            if (atividade === 'pecuaria') {
                baseProductivityGain = 24;
                carbonSequestration = 4.1;
            } else if (atividade === 'cafe') {
                baseProductivityGain = 15;
                carbonSequestration = 3.4;
            } else if (atividade === 'leite') {
                baseProductivityGain = 21;
                carbonSequestration = 3.9;
            }
            
            // Calculate
            const productivityGain = Math.round(baseProductivityGain * (sustPercent / 100) * 1.15);
            const totalCO2 = Math.round(area * carbonSequestration * (sustPercent / 100) * 0.92);
            const waterSavings = Math.round(area * 1850 * (sustPercent / 100) / 1000); // m³
            const extraIncome = Math.round(area * 1250 * (productivityGain / 100)); // R$
            
            const resultsHTML = `
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="bg-emerald-800/60 rounded-2xl p-4">
                        <div class="text-xs text-emerald-300 tracking-wider">AUMENTO DE PRODUTIVIDADE</div>
                        <div class="text-4xl font-black mt-1 tracking-tighter">${productivityGain}<span class="text-2xl align-super">%</span></div>
                    </div>
                    <div class="bg-emerald-800/60 rounded-2xl p-4">
                        <div class="text-xs text-emerald-300 tracking-wider">CO₂ SEQUESTRADO / ANO</div>
                        <div class="text-4xl font-black mt-1 tracking-tighter">${totalCO2.toLocaleString('pt-BR')}<span class="text-xl align-super">t</span></div>
                    </div>
                    
                    <div class="bg-emerald-800/60 rounded-2xl p-4 col-span-2">
                        <div class="flex justify-between items-center text-xs text-emerald-300 px-1">
                            <div>ECONOMIA DE ÁGUA</div>
                            <div>POTENCIAL DE RENDA EXTRA</div>
                        </div>
                        <div class="flex justify-between items-end mt-1 px-1">
                            <div>
                                <span class="text-3xl font-black">${waterSavings}</span>
                                <span class="text-xs ml-1">mil m³/ano</span>
                            </div>
                            <div class="text-right">
                                <span class="text-3xl font-black">R$ ${(extraIncome / 1000).toFixed(0)} mil</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-5 text-[10px] text-emerald-300 tracking-widest">Estimativa baseada em dados médios da Embrapa + estudos de ILPF e regenerativa</div>
            `;
            
            const resultsDiv = document.getElementById('calculator-results');
            resultsDiv.innerHTML = resultsHTML;
            resultsDiv.classList.remove('hidden');
            
            if (!isLiveUpdate) {
                // Confetti effect
                createConfetti();
            }
        }
        
        function createConfetti() {
            const colors = ['#166534', '#4ade80', '#15803d'];
            for (let i = 0; i < 42; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.zIndex = '9999';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-20px';
                confetti.style.width = '9px';
                confetti.style.height = '9px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.opacity = Math.random() + 0.6;
                document.body.appendChild(confetti);
                
                const duration = Math.random() * 2800 + 2400;
                const angle = Math.random() * 70 + 25;
                
                confetti.animate([
                    { transform: `translateY(0) rotate(0deg)`, opacity: confetti.style.opacity },
                    { transform: `translateY(${window.innerHeight + 120}px) rotate(${angle * 6}deg)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(.32,0,.67,1)'
                }).onfinish = () => confetti.remove();
            }
        }
        
        // ========== MODALS ==========
        const techData = [
            {
                icon: 'fa-satellite',
                title: 'Satélites + Inteligência Artificial',
                desc: 'Plataformas como o Satélite Agro da Embrapa + INPE permitem mapear a saúde do solo, identificar pragas e otimizar o uso de insumos com precisão de até 98%.',
                benefit: 'Redução média de 22% no uso de defensivos e fertilizantes.',
                example: 'Fazendas no Mato Grosso já economizam mais de R$ 180/ha/ano com essa tecnologia.'
            },
            {
                icon: 'fa-dna',
                title: 'Bioinsumos e Microbioma do Solo',
                desc: 'Uso de microrganismos benéficos (rizóbios, Bacillus, Trichoderma) que fixam nitrogênio, solubilizam fósforo e protegem contra doenças.',
                benefit: 'Aumento de até 18% na produtividade + redução de até 40% no uso de fertilizantes nitrogenados.',
                example: 'Produtores de soja no Paraná reduziram em 35% o custo com adubação nitrogenada.'
            },
            {
                icon: 'fa-robot',
                title: 'Robôs, Drones e Máquinas Autônomas',
                desc: 'Veículos autônomos para plantio, pulverização localizada e monitoramento contínuo. Reduz drasticamente a compactação do solo.',
                benefit: 'Redução de até 70% no volume de aplicação de produtos químicos.',
                example: 'Fazenda São Marcos (GO) utiliza frota de drones e tratores autônomos desde 2023.'
            },
            {
                icon: 'fa-water',
                title: 'Irrigação Inteligente 4.0',
                desc: 'Sensores de umidade no solo + estações meteorológicas + algoritmos de IA que decidem exatamente quando e quanto irrigar.',
                benefit: 'Economia média de 38% de água + aumento de 12-25% na produtividade.',
                example: 'No semiárido nordestino, projetos de ILPF irrigado estão revolucionando a produção de leite.'
            }
        ];
        
        function showTechModal(index) {
            const modal = document.getElementById('tech-modal');
            const content = document.getElementById('tech-modal-content');
            const tech = techData[index];
            
            content.innerHTML = `
                <div class="flex items-start gap-x-4">
                    <div class="w-16 h-16 flex-shrink-0 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <i class="fa-solid ${tech.icon} text-emerald-700 text-4xl"></i>
                    </div>
                    <div class="flex-1 pt-1">
                        <div class="font-extrabold text-3xl tracking-tighter">${tech.title}</div>
                    </div>
                </div>
                
                <div class="mt-8 text-[15px] leading-relaxed text-slate-600">${tech.desc}</div>
                
                <div class="mt-8 grid grid-cols-1 gap-4">
                    <div class="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                        <div class="uppercase tracking-[1.5px] text-xs font-extrabold text-emerald-700">RESULTADO COMPROVADO</div>
                        <div class="mt-1.5 text-xl font-semibold">${tech.benefit}</div>
                    </div>
                    
                    <div>
                        <div class="text-xs font-extrabold tracking-wider text-emerald-700 mb-px">EXEMPLO REAL</div>
                        <div class="text-sm">${tech.example}</div>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function hideTechModal() {
            const modal = document.getElementById('tech-modal');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
        
        const caseData = [
            {
                name: "Fazenda Santa Rita",
                location: "Sinop, Mato Grosso",
                area: "4.200 hectares",
                before: "58 sacas/ha de soja",
                after: "141 sacas/ha de soja + ILPF",
                quote: "Em quatro anos passamos de um sistema convencional degradado para um dos maiores produtividades da região. O segredo foi ILPF + bioinsumos + manejo de solo.",
                result: "+142% de produtividade • +R$ 3,8 milhões/ano de renda extra • 87 mil toneladas de CO₂ sequestradas",
                owner: "João Carlos Mendes"
            },
            {
                name: "Grupo São João",
                location: "Jataí, Goiás",
                area: "12.800 hectares",
                before: "Sistema tradicional de soja e pecuária separadas",
                after: "ILPF em 68% da área + créditos de carbono",
                quote: "Hoje somos uma referência em agricultura de baixo carbono. Exportamos soja carbono neutro para a Europa e vendemos créditos no mercado voluntário.",
                result: "-68% nas emissões de CO₂ • +41% na margem de lucro • Certificação internacional",
                owner: "Família Almeida"
            },
            {
                name: "Fazenda Veredas",
                location: "Patrocínio, Minas Gerais",
                area: "890 hectares",
                before: "Café em monocultura com alto uso de químicos",
                after: "Sistema agroflorestal + ILPF + apicultura",
                quote: "Recuperamos nascentes que estavam secas há 12 anos. Hoje temos 14 espécies de abelhas nativas e vendemos mel orgânico premium junto com o café especial.",
                result: "+87% biodiversidade • +31% no preço do café • Renda extra com mel e madeira",
                owner: "Maria Clara e Pedro Viana"
            }
        ];
        
        function showCaseModal(index) {
            const modal = document.getElementById('case-modal');
            const content = document.getElementById('case-modal-content');
            const c = caseData[index];
            
            content.innerHTML = `
                <div>
                    <div class="uppercase text-xs tracking-[2px] font-extrabold text-emerald-700">${c.location} • ${c.area}</div>
                    <div class="text-4xl font-extrabold tracking-tighter mt-1">${c.name}</div>
                    
                    <div class="mt-7 grid grid-cols-2 gap-4 text-sm">
                        <div class="border-l-4 border-red-300 pl-4">
                            <div class="text-xs text-red-600 font-bold">ANTES</div>
                            <div class="font-medium">${c.before}</div>
                        </div>
                        <div class="border-l-4 border-emerald-600 pl-4">
                            <div class="text-xs text-emerald-700 font-bold">DEPOIS (5 ANOS)</div>
                            <div class="font-medium">${c.after}</div>
                        </div>
                    </div>
                    
                    <div class="mt-8 bg-slate-50 p-6 rounded-2xl text-[15px] italic leading-relaxed">"${c.quote}"</div>
                    
                    <div class="mt-7">
                        <div class="font-extrabold text-xs tracking-wider text-emerald-700">RESULTADOS</div>
                        <div class="font-semibold mt-px">${c.result}</div>
                    </div>
                    
                    <div class="mt-7 text-xs">
                        <span class="font-medium">Produtor:</span> ${c.owner}
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function hideCaseModal() {
            const modal = document.getElementById('case-modal');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
        
        function contactProducer() {
            hideCaseModal();
            setTimeout(() => {
                const modal = document.getElementById('success-modal');
                document.getElementById('success-message').innerHTML = 'Em breve um especialista da AgroForte entrará em contato com você para conhecer o case e tirar dúvidas!';
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }, 280);
        }
        
        function joinMovement() {
            const modal = document.getElementById('success-modal');
            document.getElementById('success-message').innerHTML = 'Obrigado! Você foi inscrito no movimento AgroForte. Em até 48h você receberá um e-mail com seu plano personalizado de transição sustentável e convite para nossa comunidade exclusiva.';
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Bonus: confetti
            setTimeout(createConfetti, 400);
        }
        
        function hideSuccessModal() {
            const modal = document.getElementById('success-modal');
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
        
        function showAllTechnologies() {
            // Scroll to technologies section
            document.getElementById('tecnologias').scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight cards briefly
            setTimeout(() => {
                document.querySelectorAll('#tecnologias .agro-card').forEach((card, i) => {
                    setTimeout(() => {
                        card.style.boxShadow = '0 0 0 4px rgb(52 211 153 / 0.3)';
                        setTimeout(() => {
                            card.style.boxShadow = '';
                        }, 1100);
                    }, i * 180);
                });
            }, 900);
        }
        
        // Keyboard accessibility
        function initKeyboardSupport() {
            document.addEventListener('keydown', function(e) {
                if (e.key === '/' && document.activeElement.tagName === 'BODY') {
                    e.preventDefault();
                    const quizSection = document.getElementById('interaja');
                    quizSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            // Add aria labels where needed
            const sliderHandle = document.getElementById('slider-handle');
            if (sliderHandle) {
                sliderHandle.setAttribute('aria-label', 'Controle do comparador antes e depois. Use setas para mover.');
            }
        }
        
        // Initialize everything
        function initializeWebsite() {
            initializeTailwind();
            initNavbar();
            animateCounters();
            initComparisonSlider();
            initQuiz();
            updateCalculator(); // Initial values
            
            // Make sure calculator live updates
            const areaRange = document.getElementById('area-range');
            const sustRange = document.getElementById('sust-range');
            
            if (areaRange) areaRange.addEventListener('input', updateCalculator);
            if (sustRange) sustRange.addEventListener('input', updateCalculator);
            
            initKeyboardSupport();
            
            // Easter egg: press "f" for farm confetti
            let konami = '';
            document.addEventListener('keypress', function(e) {
                konami += e.key;
                if (konami.length > 5) konami = konami.slice(1);
                if (konami === 'futura') {
                    createConfetti();
                    konami = '';
                }
            });
            
            // Accessibility: announce quiz start
            console.log('%c[AgroForte] Site carregado com sucesso. Totalmente acessível e responsivo.', 'color:#166534');
            
            // Preload a nice interaction hint
            setTimeout(() => {
                const handle = document.getElementById('slider-handle');
                if (handle) {
                    handle.style.transition = 'left 0.6s cubic-bezier(0.34,1.56,0.64,1)';
                }
            }, 2400);
        }
        
        // Boot the website
        window.onload = initializeWebsite;
        
        // Expose some functions for debugging (optional)
        window.AgroForte = { restartQuiz: () => initQuiz(), calculateImpact };
