import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Store, 
  Users, 
  Download,
  Upload,
  MessageSquare,
  Settings,
  Package,
  ShoppingBag,
  Tag,
  QrCode,
  Megaphone,
  BarChart3,
  UserCog,
  Shield,
  DollarSign,
  Clock
} from 'lucide-react';

interface MainMenuProps {
  isCollapsed: boolean;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ icon: Icon, label, to, isActive, isCollapsed }: NavItemProps) => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate(to)}
      title={isCollapsed ? label : undefined}
      className={`
        flex items-center px-5 py-2.5 rounded-lg w-full
        transition-all duration-200
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-lg translate-x-1.5' 
          : 'text-gray-300 hover:bg-indigo-600/20 hover:text-white hover:translate-x-1.5'
        }
      `}
    >
      <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
        <Icon className="h-5 w-5" />
      </div>
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium tracking-wide truncate">
          {label}
        </span>
      )}
    </button>
  );
};

const menuGroups = [
  {
    title: "Main",
    items: [
      { icon: Store, label: "Store", to: "/" },
      { icon: Users, label: "Customers", to: "/customers" },
      { icon: Download, label: "Drop", to: "/drop" },
      { icon: Upload, label: "Pickup", to: "/pickup" },
      { icon: Clock, label: "Hold & Quick Drop", to: "/hold-quick-drop" },
      { icon: MessageSquare, label: "Messages", to: "/messages" },
    ]
  },
  {
    title: "Management",
    items: [
      { icon: Settings, label: "Operation", to: "/operation" },
      { icon: Package, label: "Supplies", to: "/supplies" },
      { icon: ShoppingBag, label: "Sales", to: "/sales" },
      { icon: Tag, label: "Sales Items", to: "/sales-items" },
      { icon: QrCode, label: "QR Codes", to: "/qrcodes" },
    ]
  },
  {
    title: "Business",
    items: [
      { icon: Megaphone, label: "Marketing", to: "/marketing" },
      { icon: BarChart3, label: "Reports", to: "/reports" },
      { icon: UserCog, label: "Staff", to: "/staff" },
      { icon: Shield, label: "Admin", to: "/admin" },
    ]
  }
];

const MainMenu: React.FC<MainMenuProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="h-full py-4 flex flex-col gap-4">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="px-4">
          {!isCollapsed && (
            <h2 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.title}
            </h2>
          )}
          <div className="space-y-1">
            {group.items.map((item, itemIndex) => (
              <NavItem
                key={itemIndex}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={currentPath === item.to}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default MainMenu;