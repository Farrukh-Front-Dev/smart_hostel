import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../pages/_app';
import NavbarButton from './NavbarButton';

export default function NavbarThemeToggle() {
  const { isDark, setIsDark } = useTheme();

  return (
    <NavbarButton
      onClick={() => setIsDark(!isDark)}
      title={isDark ? 'Light mode' : 'Dark mode'}
      tooltip={isDark ? 'Light' : 'Dark'}
    >
      {isDark ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
    </NavbarButton>
  );
}
