import { Foods, Header } from '@/components';
import AppProvider from '@/context/AppProvider';

export default function Home() {
  return (
    <AppProvider>
      <main className="h-full bg-inherit">
        <Header />
        <Foods />
      </main>
    </AppProvider>
  )
}
