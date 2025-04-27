
import { Link } from 'react-router-dom';

type NavLinksProps = {
  className?: string;
};

const NavLinks = ({ className = "" }: NavLinksProps) => {
  const links = [
    { name: 'الرئيسية', href: '/' },
    { name: 'نبض الخبر', href: '/pulse' },
    { name: 'عمق الحدث', href: '/depth' },
    { name: 'رؤى وتحليلات', href: '/insights' },
    { name: 'رياضة', href: '/sports' },
    { name: 'صوت الشارع', href: '/street-voice' },
    { name: 'ملفات خاصة', href: '/special-files' },
    { name: 'منصة الرأي', href: '/opinion' },
  ];
  
  return (
    <div className={className}>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-horus-red transition-colors"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
