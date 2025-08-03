import AdminContent from "@/components/layout/admin.content";
import AdminFooter from "@/components/layout/admin.footer";
import AdminHeader from "@/components/layout/admin.header";
import AdminSidebar from "@/components/layout/admin.sidebar";
import { Layout } from "antd";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Layout>
        <AdminSidebar />
        <Layout>
          <AdminHeader />
          <AdminContent>{children}</AdminContent>
          <AdminFooter />
        </Layout>
      </Layout>
    )
}

export default AdminLayout