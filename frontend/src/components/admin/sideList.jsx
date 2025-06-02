// sideList.jsx
import {
  Home,
  DollarSign,
  Calendar,
  Bell,
  MessageSquare,
  Newspaper,
  Settings,
} from "lucide-react";

export const sideList = [
  {
    name: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    path: "/pengurus",
  },
  {
    name: "Manajemen Berita",
    icon: <Newspaper className="w-5 h-5" />,
    path: "/pengurus/berita",
    badge: "3",
  },
  {
    name: "Donasi & Keuangan",
    icon: <DollarSign className="w-5 h-5" />,
    path: "/pengurus/keuangan",
  },
  {
    name: "Kegiatan & Kajian",
    icon: <Calendar className="w-5 h-5" />,
    path: "/pengurus/kegiatan",
  },
  {
    name: "Pengumuman",
    icon: <Bell className="w-5 h-5" />,
    path: "/pengurus/pengumuman",
    badge: "5",
  },
  {
    name: "Pesan & Feedback",
    icon: <MessageSquare className="w-5 h-5" />,
    path: "/pengurus/feedback",
    badge: "12",
  },
  {
    name: "Pengaturan",
    icon: <Settings className="w-5 h-5" />,
    path: "/pengurus/pengaturan",
  },
];
