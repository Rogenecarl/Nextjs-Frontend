import Navbar from "@/components/User/Navbar";

export default function Home() {

  return (
    <div>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to ServiceHub</h1>
            <p className="text-xl text-muted-foreground mb-8">Your one-stop platform for booking professional services</p>
            <div className="bg-card border border-border rounded-lg p-8">
              <p className="text-muted-foreground">
                This is a demo page showing the responsive navbar in action. Try resizing your browser window to see the
                mobile menu.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
