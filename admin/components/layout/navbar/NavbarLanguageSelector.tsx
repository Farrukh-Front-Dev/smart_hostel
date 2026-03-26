import { Globe } from 'lucide-react';
import { useLanguage } from '../../../pages/_app';
import NavbarButton from './NavbarButton';

export default function NavbarLanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const getLanguageName = () => {
    const names: { [key: string]: string } = {
      uz: 'O\'z',
      en: 'Eng',
      ru: 'Rus'
    };
    return names[language] || 'O\'z';
  };

  const handleLanguageChange = () => {
    const langs = ['uz', 'en', 'ru'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLanguage(langs[nextIndex] as any);
  };

  return (
    <NavbarButton onClick={handleLanguageChange} title="Tilni o'zgartirish" tooltip={getLanguageName()}>
      <Globe size={18} className="sm:w-5 sm:h-5" />
    </NavbarButton>
  );
}
