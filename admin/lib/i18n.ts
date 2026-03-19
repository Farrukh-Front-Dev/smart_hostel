export const translations = {
  uz: {
    // Navigation
    smartHostelAdmin: 'SmartHostel Admin',
    back: 'Orqaga',
    
    // Pages
    students: 'O\'quvchilar',
    duties: 'Navbatchilik',
    statistics: 'Statistika',
    
    // Students page
    nickname: 'Taxallus',
    floor: 'Qavat',
    note: 'Izoh',
    status: 'Holati',
    actions: 'Amallar',
    addStudent: 'O\'quvchi qo\'shish',
    cancel: 'Bekor qilish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    freeze: 'Muzlatish',
    unfreeze: 'Muzlatishni bekor qilish',
    allFloors: 'Barcha qavatlar',
    freezeReason: 'Muzlatish sababi:',
    updateStudent: 'O\'quvchini yangilash',
    active: 'Faol',
    frozen: 'Muzlatilgan',
    noStudents: 'O\'quvchilar topilmadi',
    failedToFetch: 'Ma\'lumot olishda xato',
    failedToSave: 'Saqlashda xato',
    failedToFreeze: 'Muzlatishda xato',
    failedToUnfreeze: 'Muzlatishni bekor qilishda xato',
    failedToDelete: 'O\'chirishda xato',
    areYouSure: 'Ishonchingiz komilmi?',
    
    // Duties page
    today: 'Bugun',
    tomorrow: 'Ertaga',
    selectDate: 'Sanani tanlang',
    noDutiesAssigned: 'Navbatchilik tayinlanmagan',
    noDutiesFound: 'Bu sana uchun navbatchilik topilmadi',
    failedToFetchDuties: 'Navbatchilikni olishda xato',
    
    // Dashboard
    totalStudents: 'Jami o\'quvchilar',
    activeStudents: 'Faol o\'quvchilar',
    frozenStudents: 'Muzlatilgan o\'quvchilar',
    manageStudents: 'O\'quvchilarni boshqarish, muzlatish/muzlatishni bekor qilish',
    viewDuties: 'Navbatchilikni ko\'rish va boshqarish',
    loading: 'Yuklanmoqda...',
  },
  en: {
    // Navigation
    smartHostelAdmin: 'SmartHostel Admin',
    back: 'Back',
    
    // Pages
    students: 'Students',
    duties: 'Duties',
    statistics: 'Statistics',
    
    // Students page
    nickname: 'Nickname',
    floor: 'Floor',
    note: 'Note',
    status: 'Status',
    actions: 'Actions',
    addStudent: 'Add Student',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    freeze: 'Freeze',
    unfreeze: 'Unfreeze',
    allFloors: 'All Floors',
    freezeReason: 'Enter reason for freezing:',
    updateStudent: 'Update Student',
    active: 'Active',
    frozen: 'Frozen',
    noStudents: 'No students found',
    failedToFetch: 'Failed to fetch students',
    failedToSave: 'Failed to save student',
    failedToFreeze: 'Failed to freeze student',
    failedToUnfreeze: 'Failed to unfreeze student',
    failedToDelete: 'Failed to delete student',
    areYouSure: 'Are you sure?',
    
    // Duties page
    today: 'Today',
    tomorrow: 'Tomorrow',
    selectDate: 'Select Date',
    noDutiesAssigned: 'No duties assigned',
    noDutiesFound: 'No duties found for this date',
    failedToFetchDuties: 'Failed to fetch duties',
    
    // Dashboard
    totalStudents: 'Total Students',
    activeStudents: 'Active Students',
    frozenStudents: 'Frozen Students',
    manageStudents: 'Manage students, freeze/unfreeze',
    viewDuties: 'View and manage duty assignments',
    loading: 'Loading...',
  },
  ru: {
    // Navigation
    smartHostelAdmin: 'SmartHostel Админ',
    back: 'Назад',
    
    // Pages
    students: 'Студенты',
    duties: 'Дежурства',
    statistics: 'Статистика',
    
    // Students page
    nickname: 'Никнейм',
    floor: 'Этаж',
    note: 'Примечание',
    status: 'Статус',
    actions: 'Действия',
    addStudent: 'Добавить студента',
    cancel: 'Отмена',
    edit: 'Редактировать',
    delete: 'Удалить',
    freeze: 'Заморозить',
    unfreeze: 'Разморозить',
    allFloors: 'Все этажи',
    freezeReason: 'Введите причину заморозки:',
    updateStudent: 'Обновить студента',
    active: 'Активный',
    frozen: 'Заморожен',
    noStudents: 'Студенты не найдены',
    failedToFetch: 'Ошибка при получении студентов',
    failedToSave: 'Ошибка при сохранении студента',
    failedToFreeze: 'Ошибка при заморозке студента',
    failedToUnfreeze: 'Ошибка при разморозке студента',
    failedToDelete: 'Ошибка при удалении студента',
    areYouSure: 'Вы уверены?',
    
    // Duties page
    today: 'Сегодня',
    tomorrow: 'Завтра',
    selectDate: 'Выберите дату',
    noDutiesAssigned: 'Дежурства не назначены',
    noDutiesFound: 'Дежурства на эту дату не найдены',
    failedToFetchDuties: 'Ошибка при получении дежурств',
    
    // Dashboard
    totalStudents: 'Всего студентов',
    activeStudents: 'Активные студенты',
    frozenStudents: 'Замороженные студенты',
    manageStudents: 'Управление студентами, заморозка/разморозка',
    viewDuties: 'Просмотр и управление назначениями дежурств',
    loading: 'Загрузка...',
  },
};

export type Language = 'uz' | 'en' | 'ru';

export const getTranslation = (lang: Language, key: keyof typeof translations.uz): string => {
  return (translations[lang] as any)[key] || key;
};
