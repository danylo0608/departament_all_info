export interface Settlement {
  name: string;
  type: 'city' | 'village';
  coordinates: { x: number; y: number };
}

export const SETTLEMENTS: Settlement[] = [
  { name: 'Полтава', type: 'city', coordinates: { x: 72, y: 55 } },
  { name: 'Кременчук', type: 'city', coordinates: { x: 48, y: 82 } },
  { name: 'Миргород', type: 'city', coordinates: { x: 46, y: 48 } },
  { name: 'Лубни', type: 'city', coordinates: { x: 25, y: 42 } },
  { name: 'Гадяч', type: 'city', coordinates: { x: 58, y: 20 } },
  { name: 'Горішні Плавні', type: 'city', coordinates: { x: 54, y: 80 } },
  { name: 'Пирятин', type: 'city', coordinates: { x: 12, y: 32 } },
  { name: 'Хорол', type: 'city', coordinates: { x: 37, y: 55 } },
  { name: 'Карлівка', type: 'city', coordinates: { x: 88, y: 58 } },
  { name: 'Кобеляки', type: 'city', coordinates: { x: 64, y: 80 } },
  { name: 'Зіньків', type: 'city', coordinates: { x: 68, y: 25 } },
  { name: 'Лохвиця', type: 'city', coordinates: { x: 33, y: 23 } },
  { name: 'Решетилівка', type: 'city', coordinates: { x: 58, y: 56 } },
  { name: 'Гребінка', type: 'city', coordinates: { x: 8, y: 40 } },
  { name: 'Глобине', type: 'city', coordinates: { x: 38, y: 69 } },
  { name: 'Диканька', type: 'village', coordinates: { x: 68, y: 43 } },
  { name: 'Нові Санжари', type: 'village', coordinates: { x: 69, y: 68 } },
  { name: 'Чорнухи', type: 'village', coordinates: { x: 20, y: 28 } },
  { name: 'Оржиця', type: 'village', coordinates: { x: 19, y: 53 } },
  { name: 'Семенівка', type: 'village', coordinates: { x: 33, y: 65 } },
  { name: 'Велика Багачка', type: 'village', coordinates: { x: 49, y: 55 } },
  { name: 'Машівка', type: 'village', coordinates: { x: 82, y: 66 } },
  { name: 'Котельва', type: 'village', coordinates: { x: 80, y: 38 } },
  { name: 'Шишаки', type: 'village', coordinates: { x: 56, y: 44 } },
  { name: 'Чутове', type: 'village', coordinates: { x: 87, y: 46 } }
];
