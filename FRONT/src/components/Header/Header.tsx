
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';

const Header = () => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 shadow-card flex-shrink-0">
      <div className="h-full flex items-center justify-between px-5">
        <HeaderLeft />
        <HeaderRight />
      </div>
    </header>
  );
};

export default Header;
