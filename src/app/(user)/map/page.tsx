import MapComponent from "@/components/User/map/map-component";
import Navbar from "@/components/User/Navbar";

export default function MapPage() {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <MapComponent />
            </div>
        </div>
    );
}
