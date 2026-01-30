
import React from 'react';
import { Season } from '../types';

interface AnnouncementBarProps {
    message: string;
    season: Season;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ message, season }) => {
    if (!message) return null;

    const getThemeStyles = () => {
        switch (season) {
            case Season.VALENTINES:
                return 'bg-asarum-red text-white shadow-asarum-red/20';
            case Season.MOTHERS_DAY:
                return 'bg-asarum-pink text-white shadow-asarum-pink/20';
            case Season.DEFAULT:
                return 'bg-asarum-dark text-white shadow-asarum-dark/20';
            default:
                return 'bg-asarum-red text-white';
        }
    };

    const getIcon = () => {
        switch (season) {
            case Season.VALENTINES: return 'fa-heart';
            case Season.MOTHERS_DAY: return 'fa-person-breastfeeding';
            default: return 'fa-bullhorn';
        }
    };

    return (
        <div className={`relative z-[60] w-full py-2.5 px-4 text-center overflow-hidden shadow-sm transition-colors duration-500 ${getThemeStyles()}`}>
            <div className="absolute inset-0 bg-white/5 opacity-10 animate-pulse"></div>
            <div className="relative flex items-center justify-center gap-3">
                <i className={`fa-solid ${getIcon()} text-xs opacity-80 animate-bounce`}></i>
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em]">
                    {message}
                </p>
                <i className={`fa-solid ${getIcon()} text-xs opacity-80 animate-bounce`}></i>
            </div>
        </div>
    );
};

export default AnnouncementBar;
