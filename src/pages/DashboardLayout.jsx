import { Routes, Route, Router } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import POS from "@/components/layout/Products/POS";
import Reports from "../pages/Reports";
import Sidebar from "@/components/layout/Sidebar";
import SalesPage from "@/components/layout/Sales/SalesPage";
import OrdersPage from "./order/OrdersPage";
import AddOrderPage from "./order/AddOrder";
import BranchesComponent from "./branches/BranchesComponent";
import AddBranches from "./branches/AddBranches";
import Login from "./Login";
import Header from "@/components/layout/Header";
import UpdateBranch from "./branches/UpdateBranch";
import ProductForm from "@/components/layout/Products/FormProduct";
import ProductUpdate from "@/components/layout/Products/ProductUpdate";
import AuditLogsTable from "@/components/layout/auditlogtable/AuditLogsTable";
import SaleForm from "@/components/layout/Sales/SaleForm";
import BranchStock from "./branchStock/BranchStock";
import VendorPurchasePage from "./VendorPurchasePage";
import AddVendor from "@/components/layout/vendors/AddVendor";
import PurchaseForm from "@/components/layout/vendors/PurchaseForm";
import LedgerTable from "@/components/layout/LedgerEntry/LedgerTable";
import PurchasePage from "@/components/layout/Purchase/PurchasePage";
function DashboardLayout() {
  return (
    <div className="flex  h-full">
      <Sidebar />
      <main className="flex-1  overflow-y-auto">
        <Header />

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pos" element={<POS />}>
            <Route path="product-form" element={<ProductForm />} />
            <Route path="add-branch" element={<AddBranches />} />

          </Route>

          <Route path="updateproduct/:id" element={<ProductUpdate />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/saleFrom/:id" element={<SaleForm />} />
          <Route path="/purchases" element={<PurchasePage />} />
          <Route path="orders" element={<OrdersPage />}>
            <Route path="new" element={<AddOrderPage />} />
          </Route>
          <Route path="/reports" element={<Reports />} />
          <Route path="/branches" element={<BranchesComponent />} />
          <Route path="/branches/update-branch/:id" element={<UpdateBranch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auditlog" element={<AuditLogsTable />} />
          <Route path="/branch-stock" element={<BranchStock />} />
          <Route path="/vendors" element={<VendorPurchasePage />} />
          <Route path="/vendors-add" element={<AddVendor />} />
          <Route path="/vendor-purchases/:vendorId" element={<PurchaseForm />} />
          <Route path="/ledger" element={<LedgerTable />} />
          <Route path="*" element={<div className="p-6">Page Not Found</div>} />
        </Routes>

      </main>
    </div>
  );
}
export default DashboardLayout;