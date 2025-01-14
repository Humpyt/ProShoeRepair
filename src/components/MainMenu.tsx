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
  DollarSign
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
      { icon: Store, label: "Store", path: "/" },
      { icon: Users, label: "Customers", path: "/customers" },
      { icon: Download, label: "Drop", path: "/drop" },
      { icon: Upload, label: "Pickup", path: "/pickup" },
      { icon: MessageSquare, label: "Messages", path: "/messages" },
    ]
  },
  {
    title: "Management",
    items: [
      { icon: Settings, label: "Operation", path: "/operation" },
      { icon: Package, label: "Supplies", path: "/supplies" },
      { icon: ShoppingBag, label: "Sales", path: "/sales" },
      { icon: Tag, label: "Sales Items", path: "/sales-items" },
      { icon: QrCode, label: "QR Codes", path: "/qrcodes" },
    ]
  },
  {
    title: "Business",
    items: [
      { icon: Megaphone, label: "Marketing", path: "/marketing" },
      { icon: BarChart3, label: "Reports", path: "/reports" },
      { icon: UserCog, label: "Staff", path: "/staff" },
      { icon: Shield, label: "Admin", path: "/admin" },
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
                to={item.path}
                isActive={currentPath === item.path}
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