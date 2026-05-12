const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 py-3 px-5 bg-white">
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-gray-400 text-xs">Copyright © 2026 Todos los derechos reservados</span>
        <span
          className="text-gray-400 text-[11px] mt-0.5 cursor-default opacity-70 hover:opacity-100 transition-opacity"
          title="Rafael Rojas Ramírez"
        >
          Desarrollado por R.R.R
        </span>
      </div>
    </footer>
  );
};

export default Footer;
