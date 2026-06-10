import pool from './config/db';

const messages = [
  "Consejo de hombres: nunca dejes que un hermano ande sin llanta de refacción. 🛞🤝",
  "El gym no miente, pero el espejo a veces sí. Confía en el proceso. 💪📈",
  "No hay peor sensación que salir de casa y recordar que no traes los audífonos. 🎧😤",
  "¿Alguien más revisa el cel apenas despierta aunque no espere nada importante? 📱😴",
  "La semana tiene 7 días pero el cuerpo solo pide descanso los 7. 😅🛌",
  "Si no le metes esfuerzo en silencio, el ruido del fracaso se escucha fuerte. 🔇🏆",
  "El café de las 6am tiene un sabor que ningún café del día iguala. ☕🌅",
  "Hay personas que llegan a tu vida a enseñarte que no todo el mundo merece tu energía. ⚡️🚪",
  "Playlist nueva, actitud nueva. Así de simple. 🎶🔥",
  "Ponerle nombre a los días de entreno y aun así saltarte el leg day. Classic. 🦵💀",
  "No todo el que va rápido sabe a dónde va. Tómate tu tiempo. 🛣️🧭",
  "La disciplina te lleva a donde la motivación no alcanza el boleto. 🎯💼",
  "Fin de semana = plan que nunca se concreta pero el grupo sigue activo. 😂📲",
  "El cuerpo lleva el peso que la mente decide soltar. 🧠🏋️",
  "Nada como llegar a casa después de un día largo y que huela a comida hecha. 🏠🍽️",
  "Los que madrugan no siempre ganan, pero los que no duermen bien siempre pierden. 😴⚠️",
  "Mantén tu círculo pequeño y tu ambición grande. 🔵📊",
  "Hay días que el único progreso fue no renunciar. Y eso cuenta. ✅🧱",
  "Si tu rutina no te incomoda un poco, probablemente no te está creciendo. 📉➡️📈",
  "Las mejores conversaciones pasan después de la medianoche o en el coche. 🌙🚗",
  "Aprender a decir que no es el mejor upgrade personal que existe. 🙅‍♂️🆙",
  "Un día sin aprender algo nuevo es un día desperdiciado. No mío, lo dijo alguien más sabio. 📚🤷",
  "La gente ocupada siempre encuentra tiempo. La gente cómoda siempre encuentra excusas. ⏱️🛋️",
  "Comprar ropa de gym para motivarte a ir al gym. Estrategia válida. 👟🧢",
  "El silencio a veces responde más que mil mensajes. 🤐💬",
  "No le expliques tu visión a quien no está construyendo nada. 🏗️👁️",
  "Fotos del before guardadas en lo más profundo del cel. Un día van a servir. 📸💪",
  "Tomar agua, dormir bien, no leer comentarios. El tríptico del bienestar. 💧😴🚫",
  "El progreso rara vez se ve en el momento. Se nota cuando volteas a ver atrás. 🔭⬅️",
  "Nuevo mes, mismo yo pero con más ganas de no serlo. 📅🔄"
];

async function seed() {
  try {
    console.log('Starting seed process...');
    // Verify if database contains any messages
    const res = await pool.query('SELECT COUNT(*) FROM messages');
    const count = parseInt(res.rows[0].count, 10);

    if (count === 0) {
      console.log('The messages table is empty. Inserting 15 mock messages...');

      const selectedMessages = messages.slice(0, 15);

      for (const text of selectedMessages) {
        const randomLikes = Math.floor(Math.random() * 10);
        await pool.query('INSERT INTO messages (text, likes) VALUES ($1, $2)', [text, randomLikes]);
      }

      console.log('Seed completed successfully. 15 messages inserted.');
    } else {
      console.log(`Database already contains ${count} messages. Skipping seeding.`);
    }
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await pool.end();
  }
}

seed();
