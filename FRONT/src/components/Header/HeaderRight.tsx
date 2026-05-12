import { useState } from 'react';
import { Maximize, Minimize } from 'react-feather';

const HeaderRight = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    return (
        <div className="flex items-center gap-1">

            <button
                className="btn-icon text-gray-500 hover:bg-gray-100 hover:text-gray-700 hidden sm:flex"
                onClick={toggleFullScreen}
                title={isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
                {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>

            <div className="relative">
                <button
                    className="btn-icon text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Notificaciones"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        width="20" height="20" strokeWidth="2">
                        <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
                        <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none pointer-events-none">
                        10
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HeaderRight;
