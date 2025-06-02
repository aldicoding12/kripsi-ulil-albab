import { createBrowserRouter, RouterProvider } from "react-router-dom";

// components jamaah
import DashboardView from "./pages/jamaah/DashboardView";
import Profilview from "./pages/jamaah/Profilview";
import LayananView from "./pages/jamaah/LayananView";
import BeritaView from "./pages/jamaah/BeritaView";
import LaporanView from "./pages/jamaah/laporanView";
import DetailBerita from "./pages/jamaah/DetailBerita";
import KegiatanView from "./pages/jamaah/KegiatanView";
import DonasiView from "./pages/jamaah/DonasiView";
import ReservasiView from "./pages/jamaah/ReservasiView";

// Pages pengurus
import Dashboard from "./pages/pengurus/Dashboard";
import LaporanManagement from "./pages/pengurus/LaporanManagement";
import BeritaManajement from "./pages/pengurus/BeritaManajement";

// auth
import LoginView from "./pages/jamaah/auth/LoginView";
import RegistrasiView from "./pages/jamaah/auth/RegistrasiView";

// layoutsnya
import PublicLayouts from "./Layouts/PublicLayouts";
import MainLayout from "./Layouts/MainLayout";

// Routernya
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayouts />,
    children: [
      { index: true, element: <DashboardView /> },
      { path: "profil", element: <Profilview /> },
      { path: "berita", element: <BeritaView /> },
      { path: "berita/:id", element: <DetailBerita /> },
      { path: "laporan", element: <LaporanView /> },
      { path: "kegiatan", element: <KegiatanView /> },
      { path: "donasi", element: <DonasiView /> },
      { path: "layanan", element: <LayananView /> },
      { path: "reservasi", element: <ReservasiView /> },
    ],
  },
  {
    path: "login",
    element: <LoginView />,
  },
  {
    path: "registrasi",
    element: <RegistrasiView />,
  },
  {
    path: "pengurus",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        handle: { title: "Dashboard" },
      },
      {
        path: "keuangan",
        element: <LaporanManagement />,
        handle: { title: "Keuangan" },
      },
      {
        path: "berita",
        element: <BeritaManajement />,
        handle: { title: "berita" },
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
