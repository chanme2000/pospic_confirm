import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/contexts/AuthContext"
import SplashScreen from "@/components/SplashScreen"
import DemoNavigator from "@/components/DemoNavigator"

function ProtectedRoute({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}

import UserMain from "@/pages/UserMain"
import UserLogin from "@/pages/UserLogin"
import UserSignup from "@/pages/UserSignup"
import FindAccount from "@/pages/FindAccount"
import Guide from "@/pages/Guide"
import ConfirmGuide from "@/pages/ConfirmGuide"
import UploadStep from "@/pages/UploadStep"
import CanvasEditor from "@/pages/CanvasEditor"
import PaymentStep from "@/pages/PaymentStep"
import CompleteStep from "@/pages/CompleteStep"
import MyPage from "@/pages/MyPage"
import AdminLogin from "@/pages/AdminLogin"
import AdminLayout from "@/layouts/AdminLayout"
import AdminOrders from "@/pages/AdminOrders"
import AdminPointLedger from "@/pages/AdminPointLedger"
import AdminSalesManager from "@/pages/AdminSalesManager"
import AdminSettings from "@/pages/AdminSettings"
import AdminStoreManager from "@/pages/AdminStoreManager"
import StoreLayout from "@/layouts/StoreLayout"
import StoreOrders from "@/pages/StoreOrders"
import SalesPortalLayout from "@/layouts/SalesPortalLayout"
import SalesDashboard from "@/pages/SalesDashboard"
import SalesRewards from "@/pages/SalesRewards"

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* 회원 (USER) 공통 라우트 */}
        <Route path="/" element={<UserMain />} />
        <Route path="/confirm-guide" element={<ConfirmGuide />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/order/upload" element={<UploadStep />} />
        <Route path="/order/edit" element={<CanvasEditor />} />
        <Route path="/order/payment" element={<PaymentStep />} />
        <Route path="/order/complete" element={<CompleteStep />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/find-account" element={<FindAccount />} />
        <Route path="/guide" element={<Guide />} />

        {/* 점주 포털 (STORE_OWNER) */}
        <Route
          path="/store"
          element={
            <ProtectedRoute roles={["STORE_OWNER", "ADMIN"]}>
              <StoreLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/store/orders" replace />} />
          <Route path="orders" element={<StoreOrders />} />
        </Route>

        {/* 영업사원 포털 (SALES) */}
        <Route
          path="/sales-portal"
          element={
            <ProtectedRoute roles={["SALES", "ADMIN"]}>
              <SalesPortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/sales-portal/dashboard" replace />} />
          <Route path="dashboard" element={<SalesDashboard />} />
          <Route path="rewards" element={<SalesRewards />} />
        </Route>

        {/* 운영자 로그인 */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 본사 어드민 (ADMIN) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="ledger" element={<AdminPointLedger />} />
          <Route path="sales" element={<AdminSalesManager />} />
          <Route path="stores" element={<AdminStoreManager />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <DemoNavigator />
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "Pretendard, system-ui, sans-serif",
          },
        }}
      />
    </BrowserRouter>
    </AuthProvider>
    </>
  )
}
