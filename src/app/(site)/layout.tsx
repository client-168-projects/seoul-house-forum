import { GoogleAnalytics } from "@/components/common/GoogleAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NoticePopupStack } from "@/components/noticePopup/NoticePopupStack";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <NoticePopupStack />
      <GoogleAnalytics />
    </>
  );
}
