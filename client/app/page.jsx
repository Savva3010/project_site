import Header from "@/cmponents/header";
import Footer from "@/cmponents/footer";
import Sidebar from "@/cmponents/sidebar";

export default function Home() {
  return (<>
    <Header />
    <div>
        <Sidebar />
        <main>
        {children}
        </main>
    </div>
    <Footer />
  </>);
}
