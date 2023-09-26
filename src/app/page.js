import { Header } from "@/components";
import AppProvider from "@/context/AppProvider";

export default function Home() {
  return (
    <AppProvider>
      <main className="h-[1000px]">
        <Header />
      </main>
    </AppProvider>
  )
}
