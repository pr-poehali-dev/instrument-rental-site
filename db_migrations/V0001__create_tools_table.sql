
CREATE TABLE t_p87698122_instrument_rental_si.tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p87698122_instrument_rental_si.tools (name, category, price, available, image, description) VALUES
('Перфоратор Bosch GBH 2-26', 'Электроинструмент', 350, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Болгарка Makita GA9020', 'Электроинструмент', 280, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Шуруповёрт DeWalt DCD796', 'Электроинструмент', 200, false, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Лазерный уровень Bosch GLL 3-80', 'Измерительный', 400, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Бетономешалка Зубр БМ-130', 'Строительное оборудование', 800, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Лобзик Makita 4350FCT', 'Электроинструмент', 250, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Циркулярная пила Bosch GKS 190', 'Электроинструмент', 300, false, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Набор ключей Kraftool', 'Ручной инструмент', 150, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Строительные леса 2х3м', 'Строительное оборудование', 1200, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Рулетка Stanley 8м', 'Измерительный', 80, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Молоток Зубр 500г', 'Ручной инструмент', 100, true, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', ''),
('Виброплита Husqvarna LF 75', 'Строительное оборудование', 950, false, 'https://cdn.poehali.dev/projects/23078fca-3765-4ec6-b43a-c83443e37571/files/0a17f442-2be8-4971-aabe-10b1d266e144.jpg', '');
