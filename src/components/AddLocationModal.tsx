import React, { useState } from 'react';
import { X, CheckCircle, MapPin, Mail, Phone, Info } from 'lucide-react';
import { MinistryLocation } from '../types';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (loc: Omit<MinistryLocation, 'id'>) => void;
}

const CITIES = [
  { name: 'Київ', x: 45, y: 40, address: 'вул. Духовна, 12, Київ' },
  { name: 'Львів', x: 18, y: 48, address: 'вул. Зелена, 18, Львів' },
  { name: 'Харків', x: 70, y: 35, address: 'пр-т Незалежності, 5, Харків' },
  { name: 'Одеса', x: 42, y: 75, address: 'вул. Соборна, 42, Одеса' },
  { name: 'Чернігів', x: 50, y: 22, address: 'вул. Миру, 9, Чернігів' },
  { name: 'Дніпро', x: 58, y: 55, address: 'вул. Шевченка, 24, Дніпро' },
  { name: 'Івано-Франківськ', x: 22, y: 58, address: 'вул. Січових Стрільців, 3, Івано-Франківськ' },
  { name: 'Вінниця', x: 38, y: 50, address: 'вул. Соборна, 15, Вінниця' },
];

export default function AddLocationModal({ isOpen, onClose, onAddLocation }: AddLocationModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'youth' | 'social' | 'education' | 'children' | 'mercy'>('youth');
  const [description, setDescription] = useState('');
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [address, setAddress] = useState(CITIES[0].address);
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    setSelectedCityIndex(index);
    setAddress(CITIES[index].address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !responsiblePerson || !email || !phone) {
      alert('Будь ласка, заповніть усі обов\'язкові поля.');
      return;
    }

    const city = CITIES[selectedCityIndex];
    
    // Determine Ukrainian type name
    let typeNameUk = 'Молодіжне';
    if (type === 'social') typeNameUk = 'Соціальне';
    else if (type === 'education') typeNameUk = 'Освіта';
    else if (type === 'children') typeNameUk = 'Дитяче';
    else if (type === 'mercy') typeNameUk = 'Милосердя';

    onAddLocation({
      name,
      type,
      typeNameUk,
      description,
      address,
      coordinates: { x: city.x, y: city.y },
      responsiblePerson,
      email,
      phone,
      detailedMission: `Ініціатива створена для надання підтримки в місті ${city.name}. Наша мета - служити Богу та ближнім.`,
      meetingsSchedule: [
        { day: 'Субота', title: 'Загальна зустріч', time: '17:00' },
        { day: 'Неділя', title: 'Молитва та спілкування', time: '12:00' }
      ]
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setDescription('');
      setResponsiblePerson('');
      setEmail('');
      setPhone('');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1b1c1c]/55 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#c3c6d1] w-full max-w-lg shadow-2xl relative overflow-hidden animate-zoomIn max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#efeded] flex justify-between items-center bg-[#fbf9f8]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5.5 h-5.5 text-[#003466]" />
            <h3 className="font-serif text-lg font-bold text-[#003466]">Додати локацію служіння</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#efeded] text-[#737781] hover:text-[#1b1c1c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-[#d5e3ff] rounded-full flex items-center justify-center text-[#003466] animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#003466]">Локацію успішно надіслано!</h4>
            <p className="font-sans text-sm text-[#424750] max-w-xs">
              Дякуємо вам за внесок. Інформація буде перевірена модератором та відобразиться на карті.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-[#1b1c1c]">
            {/* Ministry Name */}
            <div>
              <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                Назва служіння або хабу *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="наприклад, Молодіжне служіння «Світло»"
                className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
              />
            </div>

            {/* Ministry Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                  Категорія служіння *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466] cursor-pointer"
                >
                  <option value="youth">Молодіжне</option>
                  <option value="social">Соціальне</option>
                  <option value="education">Освіта</option>
                  <option value="children">Дитяче</option>
                  <option value="mercy">Милосердя</option>
                </select>
              </div>

              {/* City Selector */}
              <div>
                <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                  Місто розташування *
                </label>
                <select
                  value={selectedCityIndex}
                  onChange={handleCityChange}
                  className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466] cursor-pointer"
                >
                  {CITIES.map((city, index) => (
                    <option key={city.name} value={index}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                Точна адреса *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="вул. Хрещатик, 1, Київ"
                className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#424750] uppercase tracking-wider mb-1">
                Короткий опис діяльності *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишіть місію служіння, цілі та графік..."
                className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003466]"
              />
            </div>

            {/* Coordinator/Responsible Person details */}
            <div className="border-t border-[#efeded] pt-3 space-y-3">
              <span className="block text-xs font-bold text-[#003466] uppercase tracking-wider">
                Контакти відповідальної особи
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#424750] mb-1">
                    ПІБ служителя *
                  </label>
                  <input
                    type="text"
                    required
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    placeholder="Олександр Мельник"
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#424750] mb-1">
                    Електронна пошта *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="svitlo@ministry.ua"
                    className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#424750] mb-1">
                  Номер телефону *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+380 93 123 45 67"
                  className="w-full bg-[#fbf9f8] border border-[#c3c6d1] rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#003466]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-[#efeded] pt-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#c3c6d1] text-[#424750] hover:bg-[#fbf9f8] rounded text-xs font-semibold cursor-pointer"
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#003466] hover:bg-[#1a4b84] text-white rounded text-xs font-semibold cursor-pointer shadow-sm"
              >
                Зареєструвати служіння
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
