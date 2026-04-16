export const getMainKeyboard = () => ({
  keyboard: [
    [{ text: '💳 Oplata yuborish' }],
    [{ text: '📆 Haftalik jadval' }],
    [{ text: 'ℹ️ Ma\'lumot' }, { text: '⚙️ Yordam' }]
  ],
  resize_keyboard: true,
  persistent: true
});

export const getWeeklyScheduleKeyboard = () => {
  const today = new Date();
  const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
  const buttons = [];

  // Generate 7 days starting from today
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthNum = date.getMonth() + 1;
    
    let label;
    if (i === 0) {
      label = `📅 Bugun (${dayNum}.${monthNum})`;
    } else if (i === 1) {
      label = `📅 Ertaga (${dayNum}.${monthNum})`;
    } else {
      label = `${dayName} ${dayNum}.${monthNum}`;
    }
    
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    buttons.push([{ text: label, callback_data: `duty_date_${dateStr}` }]);
  }

  // Add back button
  buttons.push([{ text: '🔙 Orqaga', callback_data: 'back_to_menu' }]);

  return {
    inline_keyboard: buttons
  };
};

export const getMainMenuKeyboard = () => ({
  inline_keyboard: [
    [{ text: '💳 Oplata yuborish', callback_data: 'start_oplata' }],
    [
      { text: '📅 Bugungi navbatchilik', callback_data: 'today' },
      { text: '📅 Ertangi navbatchilik', callback_data: 'tomorrow' }
    ],
    [{ text: '❓ Yordam', callback_data: 'help' }]
  ]
});

export const getHelpKeyboard = () => ({
  inline_keyboard: [
    [{ text: '💳 Oplata yuborish', callback_data: 'start_oplata' }],
    [
      { text: '📅 Bugungi navbatchilik', callback_data: 'today' },
      { text: '📅 Ertangi navbatchilik', callback_data: 'tomorrow' }
    ]
  ]
});

export const getPaymentStartKeyboard = () => ({
  keyboard: [
    [{ text: '❌ Bekor qilish' }]
  ],
  resize_keyboard: true,
  one_time_keyboard: true
});

export const getPaymentConfirmKeyboard = () => ({
  inline_keyboard: [
    [
      { text: '✅ Guruhga yuborish', callback_data: 'send_payment' },
      { text: '❌ Bekor qilish', callback_data: 'cancel_payment' }
    ]
  ]
});

export const removeKeyboard = () => ({
  remove_keyboard: true
});
