import React from 'react';
import TournamentCard from '../components/TournamentCard'; 

import '../styles/tournaments.css';

const tournaments = [
  {
    icon: '/assets/icons/medal-gold-icon.svg',
    iconAlt: "Gold Medal",
    name: "Найшвидший мозок",
    prize: "15.000",
    date: "Квітень 1, 2026",
    time: "12:30",
    format: "Команда з одного",
    description: "Використовуйте свою кмітливість, щоб досягти перемоги та виграти унікальні призи. Чи готові ви до інтелектуального випробування?",
    requirements: [
      "Всі учасники команди повинні бути віком 14+",
      "Прибути на місце заздалегідь",
      "Команда з 1 гравця"
    ],
    registeredSlots: 12,
    totalSlots: 24
  },
  {
    icon: '/assets/icons/medal-silver-icon.svg',
    iconAlt: "Silver Medal",
    name: "io Дрифт",
    prize: "9.000",
    date: "April 8, 2026",
    time: "14:00",
    format: "Команда з одного",
    description: "Це ваш шанс показати, хто справжній майстер гри, і прославитися серед кращих з кращих!",
    requirements: [
      "Всі учасники команди повинні бути віком 14+.",
      "Сувора заборона на використання чит-кодів",
      "Обов'язково зареєструйтеся онлайн"
    ],
    registeredSlots: 23,
    totalSlots: 24
  },
  {
    icon: '/assets/icons/medal-bronze-icon.svg',
    iconAlt: "Bronze Medal",
    name: "Майстер вишивки",
    prize: "2.000",
    date: "April 10, 2026",
    time: "18:00",
    format: "Команда з одного",
    description: "Ви любите творити, експериментувати з кольорами та втілювати свої ідеї в життя? Тоді цей турнір для вас!",
    requirements: [
      "Всі учасники команди повинні бути віком 14+",
      "Роботи повинні бути створені виключно під час турніру",
      "Обов'язково зареєструйтеся онлайн"
    ],
    registeredSlots: 30,
    totalSlots: 30
  }
];

const TournamentsPage = () => {
  return (
    <main className="tournaments-main">
      <h1 className="tournaments-title">Найближчі турніри</h1>
      <div className="tournaments-container">
        {tournaments.map((tournament, index) => (
          <TournamentCard key={index} tournament={tournament} />
        ))}
      </div>
    </main>
  );
};

export default TournamentsPage;
