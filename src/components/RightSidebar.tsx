import { useNavigate } from 'react-router-dom';
import { CustomIcons } from './Icons';
import { DigitalClock } from './DigitalClock';

export default function RightSidebar() {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="space-y-4 flex-1">
        <button 
          onClick={() => navigate('/drop')}
          className="btn-bevel accent-primary w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-indigo-700 transition-colors"
        >
          <CustomIcons.DropPickup size={24} />
          <span className="text-sm">Drop</span>
        </button>

        <button 
          onClick={() => navigate('/pickup')}
          className="btn-bevel accent-secondary w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-emerald-700 transition-colors"
        >
          <CustomIcons.OpenDrawer size={24} />
          <span className="text-sm">Pickup</span>
        </button>

        <div className="btn-bevel accent-tertiary w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2">
          <DigitalClock />
        </div>
      </div>

      <button 
        onClick={() => navigate('/login')} 
        className="btn-bevel bg-red-600 hover:bg-red-700 w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors mt-4"
      >
        <CustomIcons.Exit size={24} />
        <span className="text-sm">Exit</span>
      </button>
    </div>
  );
}