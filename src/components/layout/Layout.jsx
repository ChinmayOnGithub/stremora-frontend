import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import Header from './Header/Header';
import EmailVerificationBanner from '../EmailVerificationBanner';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <EmailVerificationBanner />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
