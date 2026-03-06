import Banner from "@/components/Banner";
import PromoCollection from "@/components/PromoCollection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Banner />
        <PromoCollection />

        {/* Footer placeholder */}
        <footer className="bg-gray-50 py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-primary-brown font-medium">&copy; 2026 ATTIRE THREADS. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
