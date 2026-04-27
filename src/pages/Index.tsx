import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const TOOLS = [
  { id: 1, name: "Перфоратор Bosch GBH 2-26", category: "Электроинструмент", price: 350, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg" },
  { id: 2, name: "Болгарка DeWalt 125мм", category: "Электроинструмент", price: 280, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg" },
  { id: 3, name: "Шуруповёрт Makita 18V", category: "Электроинструмент", price: 200, available: false, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg" },
  { id: 4, name: "Набор ключей 24 предмета", category: "Ручной инструмент", price: 150, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/87daca41-c894-412c-a9a3-a6358177c173.jpg" },
  { id: 5, name: "Уровень лазерный 3D", category: "Измерительный", price: 400, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/87daca41-c894-412c-a9a3-a6358177c173.jpg" },
  { id: 6, name: "Рулетка + уровень", category: "Измерительный", price: 80, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/87daca41-c894-412c-a9a3-a6358177c173.jpg" },
  { id: 7, name: "Лобзик Makita JV0600", category: "Электроинструмент", price: 320, available: false, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg" },
  { id: 8, name: "Молоток кровельщика", category: "Ручной инструмент", price: 100, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/87daca41-c894-412c-a9a3-a6358177c173.jpg" },
  { id: 9, name: "Бетономешалка 120л", category: "Строительное оборудование", price: 700, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/6c221248-6ee7-4c6f-be5d-20d8732376b9.jpg" },
  { id: 10, name: "Строительные леса 6м", category: "Строительное оборудование", price: 900, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/6c221248-6ee7-4c6f-be5d-20d8732376b9.jpg" },
  { id: 11, name: "Виброплита 90кг", category: "Строительное оборудование", price: 1200, available: false, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/6c221248-6ee7-4c6f-be5d-20d8732376b9.jpg" },
  { id: 12, name: "Пила циркулярная 185мм", category: "Электроинструмент", price: 380, available: true, image: "https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg" },
];

const CATEGORIES = ["Все", "Электроинструмент", "Ручной инструмент", "Измерительный", "Строительное оборудование"];

type Section = "catalog" | "about" | "terms" | "contacts";

const navLinks: { id: Section; label: string }[] = [
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О компании" },
  { id: "terms", label: "Условия проката" },
  { id: "contacts", label: "Контакты" },
];

const EMAIL_URL = "https://functions.poehali.dev/cacde10c-23c7-4586-920f-143e6d430786";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("catalog");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [priceRange, setPriceRange] = useState([0, 1200]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!formName.trim() || !formPhone.trim()) return;
    setFormStatus("loading");
    try {
      const res = await fetch(EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, phone: formPhone, message: formMessage }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormName("");
        setFormPhone("");
        setFormMessage("");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const filtered = TOOLS.filter((t) => {
    if (activeCategory !== "Все" && t.category !== activeCategory) return false;
    if (t.price < priceRange[0] || t.price > priceRange[1]) return false;
    if (onlyAvailable && !t.available) return false;
    return true;
  });

  const scrollToSection = (id: Section) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollToSection("catalog")} className="flex items-center gap-2 font-black text-xl tracking-tight text-foreground">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
              <Icon name="Wrench" size={16} className="text-background" />
            </div>
            ПроИнструмент
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === l.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                className={`px-4 py-3 rounded-md text-sm font-medium text-left transition-colors ${activeSection === l.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-slide-up">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 font-medium">
              Прокат без залога от 80 ₽/сут
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 text-foreground">
              Любой инструмент — в нужный момент
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Профессиональный инструмент для строительства, ремонта и отделки. Выдача в день обращения, удобные условия.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button size="lg" onClick={() => scrollToSection("catalog")} className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-8">
                Смотреть каталог
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection("contacts")} className="font-semibold px-8">
                Связаться
              </Button>
            </div>
            <div className="mt-10 flex gap-8">
              {[{ v: "120+", l: "инструментов" }, { v: "5 лет", l: "на рынке" }, { v: "4.9", l: "рейтинг" }].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-black text-foreground">{s.v}</div>
                  <div className="text-sm text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in stagger-2">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/6c221248-6ee7-4c6f-be5d-20d8732376b9.jpg"
                alt="Склад инструментов"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Статус</div>
                <div className="text-sm font-semibold text-foreground">87 позиций доступно</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black mb-2 text-foreground">Каталог</h2>
          <p className="text-muted-foreground">Фильтруйте по категории, цене и доступности</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 sticky top-24">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Категория</div>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === c ? "bg-foreground text-background" : "text-foreground hover:bg-secondary"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Цена / сутки</div>
                <div className="flex justify-between text-sm font-medium mb-3 text-foreground">
                  <span>{priceRange[0]} ₽</span>
                  <span>{priceRange[1]} ₽</span>
                </div>
                <Slider
                  min={0}
                  max={1200}
                  step={50}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v)}
                  className="w-full"
                />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Доступность</div>
                <button
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-colors ${onlyAvailable ? "bg-foreground text-background" : "text-foreground hover:bg-secondary"}`}
                >
                  <Icon name={onlyAvailable ? "CheckSquare" : "Square"} size={16} />
                  Только в наличии
                </button>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Показано: <span className="font-semibold text-foreground">{filtered.length}</span> из {TOOLS.length}
                </p>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Icon name="SearchX" size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Ничего не найдено</p>
                <button
                  onClick={() => { setActiveCategory("Все"); setPriceRange([0, 1200]); setOnlyAvailable(false); }}
                  className="mt-4 text-sm underline text-foreground"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((tool, i) => (
                  <div
                    key={tool.id}
                    className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-slide-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-secondary relative">
                      <img src={tool.image} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tool.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {tool.available ? "В наличии" : "Занят"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">{tool.category}</div>
                      <h3 className="font-semibold text-foreground text-sm leading-snug mb-3">{tool.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-foreground">{tool.price} ₽</span>
                          <span className="text-xs text-muted-foreground ml-1">/ сутки</span>
                        </div>
                        <Button
                          size="sm"
                          disabled={!tool.available}
                          className={`text-xs font-semibold ${tool.available ? "bg-foreground text-background hover:bg-foreground/90" : "opacity-40 cursor-not-allowed"}`}
                        >
                          Забронировать
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-foreground text-background py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-background/50 mb-4">О компании</div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                Профессиональный инструмент без лишних трат
              </h2>
              <p className="text-background/70 leading-relaxed mb-6">
                Мы работаем с 2019 года и помогаем частным мастерам и строительным бригадам решать задачи без покупки дорогостоящего оборудования. Весь инструмент проходит техническое обслуживание перед каждой выдачей.
              </p>
              <p className="text-background/70 leading-relaxed">
                Наш склад расположен в удобном месте, работаем без выходных. Консультируем по выбору подходящего инструмента для конкретной задачи.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Wrench", title: "120+ позиций", desc: "Широкий ассортимент для любых работ" },
                { icon: "Shield", title: "Техосмотр", desc: "Каждый инструмент проверяется перед выдачей" },
                { icon: "Clock", title: "Работаем 7/7", desc: "Без выходных с 8:00 до 21:00" },
                { icon: "Truck", title: "Доставка", desc: "Привезём инструмент на объект" },
              ].map((f) => (
                <div key={f.title} className="bg-background/10 rounded-2xl p-5">
                  <Icon name={f.icon} size={24} className="text-background mb-3" />
                  <div className="font-bold text-background mb-1 text-sm">{f.title}</div>
                  <div className="text-xs text-background/60 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section id="terms" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Условия проката</div>
        <h2 className="text-3xl font-black mb-12 text-foreground">Как это работает</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { step: "01", icon: "Phone", title: "Позвоните или напишите", desc: "Уточните наличие нужного инструмента и забронируйте удобное время." },
            { step: "02", icon: "FileText", title: "Оформите договор", desc: "Паспорт + договор проката. Залог не требуется для постоянных клиентов." },
            { step: "03", icon: "CheckCircle", title: "Заберите и работайте", desc: "Инструмент исправен и готов к работе. Возврат в любое удобное время." },
          ].map((s) => (
            <div key={s.step}>
              <div className="text-6xl font-black text-muted leading-none mb-4">{s.step}</div>
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                <Icon name={s.icon} size={22} className="text-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Info" size={18} className="text-accent" />
              Общие условия
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Минимальный срок аренды — 1 сутки",
                "Оплата наличными или картой",
                "При первом обращении необходим паспорт",
                "Скидка 10% при аренде от 7 дней",
                "Инструмент выдаётся в рабочем состоянии",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="Check" size={14} className="text-green-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="AlertCircle" size={18} className="text-accent" />
              Ответственность
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Клиент несёт ответственность за сохранность",
                "При утере или поломке — возмещение стоимости",
                "Запрещена передача третьим лицам",
                "Просрочка — оплата за каждые сутки",
                "Страхование инструмента — по запросу",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="Minus" size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="bg-secondary py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Контакты</div>
          <h2 className="text-3xl font-black mb-12 text-foreground">Свяжитесь с нами</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: "Phone", title: "Телефон", lines: ["+7 (XXX) XXX-XX-XX", "Звонки с 8:00 до 21:00"] },
              { icon: "MapPin", title: "Адрес", lines: ["г. Москва, ул. Примерная, д. 1", "Пн–Вс: 8:00 – 21:00"] },
              { icon: "MessageCircle", title: "Мессенджеры", lines: ["WhatsApp", "Telegram: @proinstrument"] },
            ].map((c) => (
              <div key={c.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <Icon name={c.icon} size={22} className="text-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{c.title}</h3>
                {c.lines.map((l) => (
                  <p key={l} className="text-sm text-muted-foreground">{l}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 max-w-xl">
            <h3 className="font-bold text-foreground mb-6">Оставить заявку</h3>
            {formStatus === "success" ? (
              <div className="flex flex-col items-center py-8 text-center gap-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="CheckCircle" size={28} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg mb-1">Заявка отправлена!</p>
                  <p className="text-sm text-muted-foreground">Мы свяжемся с вами в ближайшее время.</p>
                </div>
                <button onClick={() => setFormStatus("idle")} className="text-sm text-muted-foreground underline">
                  Отправить ещё одну
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Ваше имя *</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Телефон *</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Что нужно взять?</label>
                  <textarea
                    placeholder="Опишите, какой инструмент и на сколько дней..."
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-muted-foreground resize-none"
                  />
                </div>
                {formStatus === "error" && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <Icon name="AlertCircle" size={14} />
                    Ошибка отправки. Попробуйте ещё раз или позвоните нам.
                  </p>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={formStatus === "loading" || !formName.trim() || !formPhone.trim()}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold disabled:opacity-50"
                >
                  {formStatus === "loading" ? (
                    <span className="flex items-center gap-2">
                      <Icon name="Loader" size={16} className="animate-spin" />
                      Отправляем...
                    </span>
                  ) : "Отправить заявку"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-foreground">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
              <Icon name="Wrench" size={12} className="text-background" />
            </div>
            ПроИнструмент
          </div>
          <p className="text-sm text-muted-foreground">© 2024 ПроИнструмент. Прокат инструментов.</p>
          <div className="flex gap-4">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollToSection(l.id)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}