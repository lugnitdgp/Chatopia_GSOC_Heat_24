import getCurrentUser from "@/app/actions/getCurrentUser"
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import styles from "./Sidebar.module.css";

async function Sidebar({ children }: { children: React.ReactNode;}) {

  const currentUser = await getCurrentUser();

  return (
    <div className={styles.container}>
      <DesktopSidebar currentUser={currentUser!}/>
      <MobileFooter />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Sidebar;