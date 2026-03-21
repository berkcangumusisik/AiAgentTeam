<div align="center">

# AI Agent Team OS


### Yapay Zeka Ajan Takım Platformu

<p>
  <strong>Yazılım geliştirme yaşam döngüsünün tamamını kapsayan 25+ hazır AI ajan ile takım kurun, görev atayın ve yürütmeyi gerçek zamanlı izleyin.</strong>
</p>

<p>
  <strong>Build teams from 25+ pre-built AI agents covering the entire software development lifecycle, assign tasks, and monitor execution in real-time.</strong>
</p>

<br />

<p>
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p>
  <img src="https://img.shields.io/badge/Zustand-5-443e38?style=for-the-badge" alt="Zustand" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-latest-000000?style=for-the-badge" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Ollama-Ready-white?style=for-the-badge" alt="Ollama" />
  <img src="https://img.shields.io/badge/Lisans-ISC-green?style=for-the-badge" alt="License" />
</p>

<p>
  <a href="#-kurulum">Kurulum</a> &bull;
  <a href="#-özellikler">Özellikler</a> &bull;
  <a href="#-hazır-ajanlar-25">Ajanlar</a> &bull;
  <a href="#-mimari">Mimari</a> &bull;
  <a href="#-english">English</a>
</p>

</div>

---

## :tr: Türkçe

### Nedir?

**AI Agent Team OS**, yazılım geliştirme süreçlerinizi yapay zeka ajanlarıyla otomatikleştirmenizi sağlayan kapsamlı bir platformdur. Gerçek bir yazılım organizasyonu gibi çalışan bu sistemde:

- **25+ hazır AI ajan** arasından seçim yapın (Ürün Yöneticisi, Frontend Geliştirici, QA Mühendisi, DevOps Uzmanı vb.)
- **Takım kurun** - Ajanları bir araya getirip işbirliği yapacak takımlar oluşturun
- **Çok aşamalı görevler atayın** - Pipeline tabanlı görev tanımlayın, her aşamaya farklı ajan atayın
- **Gerçek zamanlı izleyin** - SSE ile canlı zaman çizelgesi, terminal çıktısı ve maliyet takibi
- **11 farklı LLM sağlayıcı** - Ollama (yerel, ücretsiz), OpenAI, Anthropic, Gemini ve daha fazlası
- **Veritabanı gerektirmez** - Dosya tabanlı depolama, sıfır konfigürasyon

### Özellikler

| Özellik | Açıklama |
|---------|----------|
| **25+ Hazır Ajan** | 6 kategoride organize: Ürün & Planlama, Tasarım & Deneyim, Mühendislik, Kalite, Operasyonlar, Bilgi & Destek |
| **Takım Oluşturucu** | Ajan kütüphanesinden sürükle-bırak seçim, 8 hazır şablon, akıllı bileşim önerileri |
| **Görev Pipeline** | Çok aşamalı görev tanımlama, aşama başına ajan atama, aşamalar arası bağlam aktarımı |
| **Gerçek Zamanlı İzleme** | SSE ile canlı zaman çizelgesi, terminal çıktısı, dosya değişiklikleri, maliyet takibi |
| **11 LLM Sağlayıcı** | OpenAI, Anthropic, Ollama, Gemini, OpenRouter, Groq, Together AI, DeepSeek, Mistral, vLLM, LM Studio |
| **Akıllı Model Çözümleme** | Takım politikası > ajan modeli > uygulama ayarları sırasıyla model seçimi, etkin olmayan provider'a otomatik fallback |
| **Dosya Tabanlı Depolama** | Veritabanı gerektirmez, JSON/JSONL ile çalışır, repository soyutlaması ile DB geçişine hazır |
| **Güvenli Araç Yürütme** | Dizin geçişi koruması, salt okunur mod, URL-encoded yol desteği, çalışma dizini sınırlaması |
| **Koyu/Açık Tema** | next-themes ile tam tema desteği |
| **Tam Türkçe Arayüz** | Tüm kullanıcı arayüzü Türkçe |

### Hazır Ajanlar (25)

<details>
<summary><strong>Ürün & Planlama (5 ajan)</strong></summary>

| Ajan | Sorumluluklar |
|------|---------------|
| **Ürün Yöneticisi** | PRD oluşturma, kullanıcı hikayeleri, özellik önceliklendirme, yol haritası planlama |
| **Ürün Sahibi** | Backlog yönetimi, kabul kriterleri, özellik detaylandırma, paydaş iletişimi |
| **İş Analisti** | İhtiyaç analizi, sistem analizi, gereksinim dokümanları, süreç modelleme |
| **Teknik Proje Yöneticisi** | Ekipler arası koordinasyon, bağımlılık haritalama, yürütme planları |
| **Sprint Planlayıcı** | Sprint ayrıştırma, story point tahminleme, önceliklendirme, kapasite planlama |

</details>

<details>
<summary><strong>Tasarım & Deneyim (3 ajan)</strong></summary>

| Ajan | Sorumluluklar |
|------|---------------|
| **UI/UX Tasarımcı** | Wireframe, kullanıcı akışları, tasarım spesifikasyonları, prototipleme |
| **Tasarım Sistemi** | Bileşen kütüphanesi, tasarım tokenları, stil rehberleri, tutarlılık denetimi |
| **Responsive Deneyim** | Duyarlı düzenler, erişilebilirlik, cihazlar arası UX, mobil optimizasyon |

</details>

<details>
<summary><strong>Mühendislik (5 ajan)</strong></summary>

| Ajan | Sorumluluklar |
|------|---------------|
| **Frontend Geliştirici** | React/HTML/CSS, bileşen geliştirme, stil uygulama, responsive kodlama |
| **React/Next.js Uzmanı** | Next.js App Router, SSR/SSG, React kalıpları, performans optimizasyonu |
| **Backend Geliştirici** | API tasarımı, sunucu mantığı, veri modelleri, iş kuralları |
| **API Entegrasyon** | REST/GraphQL entegrasyonu, SDK geliştirme, 3. parti servis bağlantıları |
| **Full Stack Geliştirici** | Uçtan uca özellik geliştirme, frontend-backend koordinasyonu |

</details>

<details>
<summary><strong>Kalite (4 ajan)</strong></summary>

| Ajan | Sorumluluklar |
|------|---------------|
| **QA & Test Mühendisi** | Test planları, test senaryoları, E2E testler, test otomasyonu |
| **Hata Avcısı** | Hata analizi, tekrarlama adımları, kök neden analizi, regresyon testi |
| **Kod İnceleyici** | Kod inceleme, en iyi pratikler, güvenlik denetimi, kod kalitesi |
| **Refactoring Uzmanı** | Kod temizliği, performans optimizasyonu, teknik borç temizliği |

</details>

<details>
<summary><strong>Operasyonlar (4 ajan)</strong></summary>

| Ajan | Sorumluluklar |
|------|---------------|
| **DevOps Mühendisi** | CI/CD, Docker, altyapı, otomasyon, ortam yönetimi |
| **Deployment & Release** | Sürüm yönetimi, deployment betikleri, rollback planları |
| **Git İş Akışı** | Dallanma stratejileri, PR yönetimi, birleştirme iş akışları, çakışma çözümü |
| **İzleme & Gözlemlenebilirlik** | Loglama, uyarı sistemleri, performans izleme, dashboard kurulumu |

</details>

<details>
<summary><strong>Bilgi & Destek (4 ajan)</strong></summary>

| Ajan | Sorumluluklar |
|------|---------------|
| **Dokümantasyon Uzmanı** | Teknik dokümanlar, API dokümanları, kullanıcı kılavuzları, README |
| **Araştırmacı** | Teknoloji araştırması, rekabet analizi, POC geliştirme, fizibilite |
| **Prompt Mühendisi** | Prompt optimizasyonu, AI iş akışı tasarımı, LLM değerlendirme |
| **Proje Analisti** | Kod tabanı analizi, mimari inceleme, bağımlılık denetimi, metrik analizi |

</details>

### Hazır Takım Şablonları (8)

| Şablon | Ajanlar | Kullanım Senaryosu |
|--------|---------|-------------------|
| **MVP Builder** | PM, İş Analisti, UI/UX, Full Stack, QA, Doküman | Hızlı prototipleme ve MVP geliştirme |
| **Full Stack Delivery** | PO, Teknik PM, Frontend, Backend, QA, İnceleyici, DevOps, İzleme, Doküman | Uçtan uca yazılım teslimatı |
| **Bug Fix Squad** | Hata Avcısı, Frontend, Backend, QA, İnceleyici | Hata tespit ve düzeltme |
| **Refactor Team** | Refactoring, İnceleyici, QA, Doküman | Kod iyileştirme ve teknik borç |
| **Product Discovery** | PM, İş Analisti, Araştırmacı, UI/UX, Sprint Planlayıcı | Ürün keşif ve araştırma |
| **Launch Team** | PO, DevOps, Deployment, İzleme, QA, Doküman | Yayınlama ve deployment |
| **Design to Dev** | UI/UX, Tasarım Sistemi, Frontend, Responsive, İnceleyici | Tasarımdan geliştirmeye |
| **Enterprise Delivery** | PO, Teknik PM, Frontend, Backend, API, QA, İnceleyici, DevOps, İzleme, Doküman | Büyük ölçekli kurumsal teslimat |

### Desteklenen LLM Sağlayıcıları (11)

| Sağlayıcı | Tür | API Formatı | Örnek Modeller |
|------------|-----|-------------|----------------|
| **Ollama** | Yerel (Ücretsiz) | Ollama | Llama 3.1 8B/70B, CodeLlama, DeepSeek Coder, Qwen 2.5 |
| **OpenAI** | Bulut | OpenAI | GPT-4o, GPT-4o Mini, GPT-4 Turbo, o1, o1 Mini |
| **Anthropic** | Bulut | Anthropic | Claude Sonnet 4.5, Claude Haiku 3.5 |
| **Google Gemini** | Bulut | Gemini | Gemini 2.0 Flash, Gemini 1.5 Pro |
| **OpenRouter** | Bulut | OpenAI | GPT-4o, Claude 3.5, Llama 405B (birçok model) |
| **Groq** | Bulut | OpenAI | Llama 3.1 70B/8B, Mixtral 8x7B |
| **Together AI** | Bulut | OpenAI | Llama 3.1 70B/8B, Qwen 2.5 Coder 32B |
| **DeepSeek** | Bulut | OpenAI | DeepSeek V3, DeepSeek Coder |
| **Mistral** | Bulut | OpenAI | Mistral Large, Mistral Small, Codestral |
| **vLLM** | Yerel | OpenAI | Yerel model (yapılandırılabilir) |
| **LM Studio** | Yerel | OpenAI | Yerel model (yapılandırılabilir) |

### Kurulum

#### Gereksinimler

- **Node.js** 18+ (20 önerilir)
- **npm** 9+
- (İsteğe bağlı) **Ollama** - Yerel LLM çalıştırmak için ([ollama.ai](https://ollama.ai))

#### Hızlı Başlangıç

```bash
# 1. Repoyu klonlayın
git clone https://github.com/berkcangumusisik/AiAgentTeam.git
cd AiAgentTeam

# 2. Bağımlılıkları yükleyin
npm install

# 3. Ortam değişkenlerini kopyalayın
cp .env.example .env.local

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcıda **http://localhost:3000** adresini açın.

#### Ollama ile Kullanım (Ücretsiz, Yerel, Önerilen)

Ollama ile hiçbir API anahtarına ihtiyacınız yok:

```bash
# 1. Ollama'yı yükleyin
# Windows: https://ollama.ai/download
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh

# 2. Bir model indirin
ollama pull llama3.1:8b

# 3. Ollama'nın çalıştığını doğrulayın
ollama list

# Uygulama varsayılan olarak Ollama kullanır - ek yapılandırma gerekmez!
```

#### Bulut API ile Kullanım

1. Uygulamayı başlatın: `npm run dev`
2. **Ayarlar > Sağlayıcılar** (`/settings/providers`) sayfasına gidin
3. İstediğiniz sağlayıcıyı etkinleştirip API anahtarını girin
4. **Bağlantıyı Test Et** butonuyla doğrulayın
5. **Ayarlar** (`/settings`) sayfasından varsayılan sağlayıcıyı ve modeli seçin

#### Ortam Değişkenleri

```env
# AI Sağlayıcıları (kullanmak istediğinizi doldurun)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
OLLAMA_BASE_URL=http://localhost:11434    # Varsayılan
OPENROUTER_API_KEY=sk-or-...
GROQ_API_KEY=gsk_...
TOGETHER_API_KEY=...
DEEPSEEK_API_KEY=sk-...
MISTRAL_API_KEY=...

# Uygulama Ayarları
DATA_DIR=./data          # Veri dizini (varsayılan: ./data)
NODE_ENV=development
```

### Kullanım Rehberi

#### 1. Ajanları Keşfedin (`/agents`)
25 hazır ajanı kategori filtresi ve arama ile keşfedin. Her ajanın sorumlulukları, yetenekleri, risk seviyesi ve önerilen görevlerini inceleyin.

#### 2. Takım Kurun (`/teams/new`)
- Hazır şablonlardan birini seçin veya sıfırdan takım oluşturun
- Sol panelden ajanları seçip takıma ekleyin
- Her ajan için rol, model geçersiz kılma ve erişim seviyesi belirleyin
- Takım model politikasını yapılandırın (varsayılan sağlayıcı/model, bütçe limiti)

#### 3. Görev Oluşturun (`/tasks/new`)
- Görev başlığı, açıklaması ve çalışma dizinini belirleyin
- Takım seçin
- Pipeline aşamalarını tanımlayın (her aşamaya farklı ajan atayabilirsiniz)
- Öncelik seviyesini ayarlayın

#### 4. Çalıştırın & İzleyin
- Görev detay sayfasından **Çalıştır** butonuna tıklayın
- Çalıştırma sayfasında (`/runs/[id]`) gerçek zamanlı izleyin:
  - **Zaman Çizelgesi** - Tüm olayları kronolojik sırada görün
  - **Terminal Çıktısı** - Ajan komut çıktılarını canlı izleyin
  - **Ajan Durumu** - Her ajanın ne yaptığını görün (düşünüyor, araç çağırıyor, tamamlandı)
  - **Maliyet Takibi** - Token kullanımı ve tahmini maliyet
  - **Dosya Değişiklikleri** - Oluşturulan, değiştirilen, silinen dosyalar
- **İzleme** (`/monitor`) sayfasında tüm aktif çalıştırmaları genel görünümde izleyin

### Teknoloji Yığını

| Katman | Teknoloji | Amaç |
|--------|-----------|------|
| **Framework** | Next.js 16 (App Router, Turbopack) | Sunucu ve istemci tarafı rendering |
| **Dil** | TypeScript 5.9 | Tip güvenliği |
| **UI Kütüphanesi** | React 19 | Bileşen tabanlı arayüz |
| **Stil** | Tailwind CSS 4 + shadcn/ui | Modern, erişilebilir UI bileşenleri |
| **Durum Yönetimi** | Zustand 5 | Hafif, hook tabanlı global state |
| **Gerçek Zamanlı** | Server-Sent Events (SSE) | Sunucudan istemciye tek yönlü akış |
| **Yürütme** | child_process | Terminal komutları ve süreç yönetimi |
| **Depolama** | JSON/JSONL dosya tabanlı | Sıfır konfigürasyon, repository soyutlaması |
| **İkonlar** | Lucide React | 1500+ modern ikon seti |
| **Tema** | next-themes | Koyu/açık/sistem tema desteği |
| **Bildirimler** | Sonner | Toast bildirimleri |

### Mimari

```
ai-agent-team-os/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (dashboard)/              # Dashboard layout grubu
│   │   │   ├── page.tsx              # Ana sayfa (istatistikler, hızlı işlemler)
│   │   │   ├── agents/               # Ajan kütüphanesi ve detay
│   │   │   ├── teams/                # Takım listesi, oluşturma, düzenleme
│   │   │   ├── tasks/                # Görev listesi, oluşturma, detay
│   │   │   ├── runs/                 # Çalıştırma geçmişi ve canlı izleme
│   │   │   ├── monitor/              # Gerçek zamanlı izleme panosu
│   │   │   └── settings/             # Ayarlar ve sağlayıcı yönetimi
│   │   ├── api/                      # 20+ API endpoint
│   │   │   ├── agents/               # Ajan CRUD + kütüphane
│   │   │   ├── teams/                # Takım CRUD + preset'ler + öneriler
│   │   │   ├── tasks/                # Görev CRUD + yürütme tetikleme
│   │   │   ├── runs/                 # Çalıştırma detay + SSE akışı + durdurma
│   │   │   ├── providers/            # Sağlayıcı yapılandırma + bağlantı testi
│   │   │   ├── workspace/            # Dosya ağacı + dosya okuma
│   │   │   ├── settings/             # Uygulama ayarları
│   │   │   └── health/               # Sağlık kontrolü
│   │   └── layout.tsx                # Kök layout (tema, font, metadata)
│   │
│   ├── components/
│   │   ├── agents/                   # AgentCard, AgentGrid, CategoryFilter, Search, Detail
│   │   ├── layout/                   # AppShell, Sidebar, Header, ThemeToggle
│   │   ├── providers/                # ProviderCard, ModelSelector
│   │   ├── runs/                     # Timeline, Terminal, AgentStatus, CostTracker, FileChanges, EventLog
│   │   ├── shared/                   # PageHeader, EmptyState, LoadingSpinner, SearchInput, ConfirmDialog
│   │   ├── tasks/                    # TaskCard, TaskCreateForm, TaskPipeline
│   │   ├── teams/                    # TeamBuilder, TeamCard, AgentSlot, PresetPicker, Suggestions
│   │   └── ui/                       # shadcn/ui bileşenleri (button, card, dialog, vb.)
│   │
│   └── lib/
│       ├── engine/                   # Yürütme Motoru
│       │   ├── orchestrator.ts       #   Aşama tabanlı görev orkestrasyonu
│       │   ├── executor.ts           #   Ajan-LLM etkileşim döngüsü (maks 20 iterasyon)
│       │   ├── tool-runner.ts        #   Korumalı araç yürütme (dosya I/O, terminal)
│       │   └── prompt-builder.ts     #   Dinamik sistem prompt oluşturma
│       │
│       ├── providers/                # LLM Sağlayıcı Uygulamaları
│       │   ├── base.provider.ts      #   Soyut sağlayıcı arayüzü
│       │   ├── openai.provider.ts    #   OpenAI uyumlu (8 sağlayıcı destekler)
│       │   ├── anthropic.provider.ts #   Anthropic Messages API
│       │   ├── ollama.provider.ts    #   Ollama API
│       │   ├── gemini.provider.ts    #   Google Gemini API
│       │   └── registry.ts          #   Sağlayıcı fabrikası ve model eşleştirme
│       │
│       ├── repositories/            # Veri Erişim Katmanı
│       │   ├── interfaces/          #   Repository arayüzleri (IRepository<T>, IAgentRepo, vb.)
│       │   ├── file/                #   Dosya tabanlı uygulamalar
│       │   └── index.ts             #   Singleton factory fonksiyonları
│       │
│       ├── services/                # İş Mantığı Katmanı
│       │   ├── agent.service.ts     #   Arama, filtreleme, klonlama
│       │   ├── team.service.ts      #   Bileşim, öneri algoritması
│       │   ├── task.service.ts      #   Yaşam döngüsü, aşama yönetimi
│       │   ├── run.service.ts       #   Durum geçişleri, maliyet takibi
│       │   ├── workspace.service.ts #   Dosya ağacı, içerik okuma
│       │   └── provider.service.ts  #   Bağlantı testi, yapılandırma
│       │
│       ├── stores/                  # Zustand State Store'ları
│       │   ├── agent.store.ts       #   Ajan listesi, filtreleme, CRUD
│       │   ├── team.store.ts        #   Takım listesi, preset'ler, CRUD
│       │   ├── task.store.ts        #   Görev listesi, yürütme
│       │   ├── run.store.ts         #   Çalıştırma, SSE entegrasyonu
│       │   ├── provider.store.ts    #   Sağlayıcı test/güncelleme
│       │   └── ui.store.ts          #   Sidebar durumu
│       │
│       ├── hooks/                   # React Custom Hook'lar
│       │   ├── use-agents.ts        #   Ajan verisi ve aksiyonlar
│       │   ├── use-teams.ts         #   Takım verisi ve aksiyonlar
│       │   ├── use-tasks.ts         #   Görev verisi ve aksiyonlar
│       │   ├── use-runs.ts          #   Çalıştırma verisi ve aksiyonlar
│       │   ├── use-providers.ts     #   Sağlayıcı verisi ve aksiyonlar
│       │   └── use-run-events.ts    #   SSE aboneliği, otomatik yeniden bağlantı
│       │
│       ├── types/                   # TypeScript Tip Tanımları
│       │   ├── agent.ts             #   Agent, AgentCategory, AgentCapability
│       │   ├── team.ts              #   Team, TeamAgent, TeamModelPolicy
│       │   ├── task.ts              #   Task, TaskStatus, TaskStage
│       │   ├── run.ts               #   Run, RunStatus, RunAgentState
│       │   ├── events.ts            #   RunEvent, RunEventType (18 olay tipi)
│       │   ├── provider.ts          #   ProviderConfig, ModelInfo
│       │   └── settings.ts          #   AppSettings
│       │
│       └── utils/                   # Yardımcı Fonksiyonlar
│           ├── constants.ts         #   DATA_PATHS, AGENT_CATEGORIES, DEFAULT_SETTINGS
│           ├── fs.ts                #   readJSON, writeJSON, ensureDir, appendToFile
│           ├── id.ts                #   nanoid tabanlı ID üretimi
│           ├── errors.ts            #   NotFoundError, ValidationError
│           └── logger.ts            #   Renkli konsol logger
│
├── data/                            # Veri Dizini
│   ├── agents/
│   │   ├── library/                 # 25 hazır ajan tanımı (JSON)
│   │   └── custom/                  # Kullanıcı oluşturduğu ajanlar
│   ├── teams/
│   │   ├── presets/                 # 8 hazır takım şablonu (JSON)
│   │   └── custom/                  # Kullanıcı oluşturduğu takımlar
│   ├── providers/                   # Sağlayıcı yapılandırması (providers.json)
│   ├── settings/                    # Uygulama ayarları (app.json)
│   ├── tasks/                       # Görev verileri (gitignored)
│   └── runs/                        # Çalıştırma verileri - JSONL olayları (gitignored)
│
├── .env.example                     # Ortam değişkenleri şablonu
├── next.config.ts                   # Next.js yapılandırması
├── tsconfig.json                    # TypeScript yapılandırması
├── postcss.config.mjs               # PostCSS (Tailwind)
└── components.json                  # shadcn/ui yapılandırması
```

### Tasarım Kararları

| Karar | Gerekçe |
|-------|---------|
| **WebSocket yerine SSE** | Sunucudan istemciye tek yönlü akış için daha basit; komutlar HTTP POST ile gönderilir |
| **Olaylar için JSONL** | Yalnızca ekleme (append-only), yeni olaylar için tüm dosyayı ayrıştırma gerekmez |
| **OpenAI uyumlu sağlayıcı paylaşımı** | 11 sağlayıcıdan 8'i aynı API formatını kullanır, tek uygulama yeterli |
| **Repository singleton kalıbı** | Dosya→DB geçişi servis katmanına dokunmadan yapılabilir |
| **Aşama tabanlı orkestrasyon** | Her aşama = bir ajan, aşamalar arası bağlam zinciri ile bilgi aktarımı |
| **ToolRunner koruması** | Yol çözümleme dizin geçişini önler, URL-encoded karakter desteği, salt okunur zorlama |
| **Platform farkındalığı** | Windows'ta PowerShell, Unix'te Bash kullanımı otomatik algılama |
| **Akıllı model fallback** | Etkin olmayan provider'daki model için otomatik olarak ayarlardaki provider'a düşme |

### API Endpoint'leri

<details>
<summary><strong>20+ REST API endpoint (tıklayarak açın)</strong></summary>

| Metot | Yol | Amaç |
|-------|-----|------|
| `GET` | `/api/agents/library` | Kütüphane ajanlarını listele |
| `GET` | `/api/agents` | Tüm ajanları listele |
| `POST` | `/api/agents` | Özel ajan oluştur |
| `GET` | `/api/agents/[agentId]` | Ajan detayı |
| `PUT` | `/api/agents/[agentId]` | Ajan güncelle |
| `DELETE` | `/api/agents/[agentId]` | Ajan sil |
| `GET` | `/api/teams/presets` | Hazır takım şablonlarını listele |
| `GET` | `/api/teams` | Tüm takımları listele |
| `POST` | `/api/teams` | Takım oluştur |
| `GET` | `/api/teams/[teamId]` | Takım detayı |
| `PUT` | `/api/teams/[teamId]` | Takım güncelle |
| `DELETE` | `/api/teams/[teamId]` | Takım sil |
| `GET` | `/api/teams/suggestions` | Takım bileşim önerileri |
| `GET` | `/api/tasks` | Görevleri listele |
| `POST` | `/api/tasks` | Görev oluştur |
| `GET` | `/api/tasks/[taskId]` | Görev detayı |
| `PUT` | `/api/tasks/[taskId]` | Görev güncelle |
| `DELETE` | `/api/tasks/[taskId]` | Görev sil |
| `POST` | `/api/tasks/[taskId]/execute` | Görev yürütmeyi başlat |
| `GET` | `/api/runs` | Çalıştırmaları listele |
| `GET` | `/api/runs/[runId]` | Çalıştırma detayı |
| `GET` | `/api/runs/[runId]/events` | SSE olay akışı |
| `POST` | `/api/runs/[runId]/stop` | Çalıştırmayı durdur |
| `GET` | `/api/providers` | Sağlayıcıları getir |
| `PUT` | `/api/providers` | Sağlayıcı güncelle |
| `POST` | `/api/providers/test` | Bağlantı testi |
| `GET` | `/api/workspace/files` | Dosya ağacı |
| `GET` | `/api/workspace/read` | Dosya içeriği oku |
| `GET` | `/api/settings` | Ayarları getir |
| `PUT` | `/api/settings` | Ayarları güncelle |
| `GET` | `/api/health` | Sağlık kontrolü |

</details>

### Proje İstatistikleri

| Metrik | Değer |
|--------|-------|
| TypeScript dosyaları | 143 |
| React bileşenleri | 49 |
| API endpoint'leri | 20+ |
| Hazır ajanlar | 25 |
| Takım şablonları | 8 |
| LLM sağlayıcıları | 11 |
| Olay tipleri | 18 |
| Satır kodu | ~8000+ |

---

<a name="-english"></a>

## :gb: English

### What is it?

**AI Agent Team OS** is a comprehensive platform that automates your software development processes with AI agents. Like a real software organization, this system lets you:

- **Choose from 25+ pre-built AI agents** (Product Manager, Frontend Developer, QA Engineer, DevOps Specialist, etc.)
- **Build teams** - Compose collaborative agent teams with role assignments
- **Assign multi-stage tasks** - Define pipeline-based tasks with different agents per stage
- **Monitor in real-time** - Live timeline, terminal output, cost tracking via SSE
- **11 LLM providers** - Ollama (local, free), OpenAI, Anthropic, Gemini, and more
- **Zero database** - File-based storage, zero configuration needed

### Features

| Feature | Description |
|---------|-------------|
| **25+ Pre-built Agents** | 6 categories: Product & Planning, Design & Experience, Engineering, Quality, Operations, Knowledge & Support |
| **Team Builder** | Agent library selection, 8 preset templates, smart composition suggestions |
| **Task Pipeline** | Multi-stage task definition, per-stage agent assignment, inter-stage context passing |
| **Real-time Monitoring** | SSE-powered live timeline, terminal output, file changes, cost tracking |
| **11 LLM Providers** | OpenAI, Anthropic, Ollama, Gemini, OpenRouter, Groq, Together AI, DeepSeek, Mistral, vLLM, LM Studio |
| **Smart Model Resolution** | Team policy > agent model > app settings priority, automatic fallback for disabled providers |
| **File-based Storage** | No database required, JSON/JSONL with repository abstraction ready for DB migration |
| **Secure Tool Execution** | Directory traversal protection, read-only mode, URL-encoded path support, workspace sandboxing |
| **Dark/Light Theme** | Full theme support via next-themes |
| **Turkish UI** | Complete Turkish localization |

### Quick Start

#### Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+
- (Optional) **Ollama** - For local LLMs ([ollama.ai](https://ollama.ai))

#### Installation

```bash
# Clone the repository
git clone https://github.com/berkcangumusisik/AiAgentTeam.git
cd AiAgentTeam

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

#### Using with Ollama (Free, Local, Recommended)

No API keys needed with Ollama:

```bash
# Install Ollama
# Windows: https://ollama.ai/download
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.1:8b

# Verify Ollama is running
ollama list

# The app defaults to Ollama - no additional configuration needed!
```

#### Using with Cloud APIs

1. Start the app: `npm run dev`
2. Navigate to **Settings > Providers** (`/settings/providers`)
3. Enable your desired provider and enter the API key
4. Click **Test Connection** to verify
5. In **Settings** (`/settings`), select the default provider and model

### Usage Guide

1. **Browse Agents** (`/agents`) - Explore 25 agents with category filters and search
2. **Create a Team** (`/teams/new`) - Use presets or build custom teams with role/model configuration
3. **Create a Task** (`/tasks/new`) - Define pipeline stages and assign agents to each stage
4. **Execute & Monitor** - Run tasks and watch progress in real-time on the monitoring page (`/monitor`)

### Pre-built Agents (25)

<details>
<summary><strong>View all 25 agents by category</strong></summary>

**Product & Planning (5):** Product Manager, Product Owner, Business Analyst, Technical PM, Sprint Planner

**Design & Experience (3):** UI/UX Designer, Design System, Responsive Experience

**Engineering (5):** Frontend Developer, React/Next.js Specialist, Backend Developer, API Integration, Full Stack Developer

**Quality (4):** QA & Test Engineer, Bug Hunter, Code Reviewer, Refactoring Specialist

**Operations (4):** DevOps Engineer, Deployment & Release, Git Workflow, Monitoring & Observability

**Knowledge & Support (4):** Documentation Specialist, Researcher, Prompt Engineer, Project Analyst

</details>

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **SSE over WebSocket** | Simpler for unidirectional server-to-client streaming; commands via HTTP POST |
| **JSONL for events** | Append-only, no full file parsing needed for new events |
| **OpenAI-compatible provider reuse** | 8 of 11 providers share the same API format, single implementation |
| **Repository singleton pattern** | File-to-DB swap without touching the service layer |
| **Stage-based orchestration** | Each stage = one agent, context chains enable knowledge transfer between stages |
| **ToolRunner sandboxing** | Path resolution prevents directory traversal, URL-encoded char support, read-only enforcement |
| **Platform awareness** | Automatic PowerShell on Windows, Bash on Unix |
| **Smart model fallback** | Auto-fallback to app settings when a model's provider is disabled |

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router, Turbopack) | SSR, API routes, file-system routing |
| **Language** | TypeScript 5.9 | Type safety across the stack |
| **UI Library** | React 19 | Component-based UI |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Modern, accessible UI components |
| **State** | Zustand 5 | Lightweight, hook-based global state |
| **Real-time** | Server-Sent Events (SSE) | Unidirectional server-to-client streaming |
| **Execution** | child_process | Terminal command execution |
| **Storage** | JSON/JSONL file-based | Zero-config, repository abstraction |

---

<div align="center">

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

<p>
  <strong>143 TypeScript files</strong> &bull;
  <strong>49 React components</strong> &bull;
  <strong>20+ API endpoints</strong> &bull;
  <strong>25 AI agents</strong> &bull;
  <strong>11 LLM providers</strong>
</p>

<br />

Made with :heart: by [Berkcan Gumusisik](https://github.com/berkcangumusisik)

</div>
