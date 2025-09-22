import { GoogleMap } from "@angular/google-maps";
import { Component } from "@angular/core";
import { HeaderComponent } from "../component/common/header/header.component";
import { FooterComponent } from "../component/common/footer/footer.component";
import { NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "../component/common/breadcrumb/breadcrumb.component";
import { HomeService } from "../services/home.service";
@Component({
  selector: "app-store",
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    BreadcrumbComponent,
  ],
  templateUrl: "./store.component.html",
  styleUrl: "./store.component.scss",
})
export class StoreComponent {
  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  locations: any[] = [];
  allLocations: any[] = [];

  constructor(
    private ngZone: NgZone,
    private service: HomeService
  ) { }
   isSimilar(str: string, query: string): boolean {
    if (!str || !query) return false;

    str = str.toLowerCase();
    query = query.toLowerCase();

    // Exact contains
    if (str.includes(query)) return true;

    // Simple fuzzy match → మొదటి 3 letters చూసి
    return str.includes(query.substring(0, Math.min(2, query.length)));
  }
  ngOnInit(): void {
    // 🚀 Fetch stores from backend immediately when component loads
    this.getStoresFromAPI();
  }

  ngAfterViewInit(): void {
    this.loadGoogleMaps().then(() => {
      this.initMap();
    });
  }

  private loadGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyDpk6Vp36fzxxZu-R_UhM0Qd3W92Urkvos&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  // master list (API data)


  initMap(): void {
    const defaultLocation = { lat: -40.9006, lng: 174.8860 }; // default center
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: defaultLocation,
      zoom: 5,
    });

    const input = document.getElementById('search-input') as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    // ✅ Load stores from API
    // this.getStoresFromAPI();

    // ✅ Setup search filter
    searchBox.addListener("places_changed", () => {
  this.ngZone.run(() => {
    const query = input.value.toLowerCase();

    if (!query) {
      this.locations = [...this.allLocations];
    } else {
      this.locations = this.allLocations.filter(
        (store) =>
          this.isSimilar(store.name, query) ||
          this.isSimilar(store.address, query)
      );
    }

    if (this.locations.length === 0) {
      alert("❌ This location not found");
      this.locations = [...this.allLocations]; // reset to all
    }

    console.log("🔎 Filtered Stores:", this.locations);
    this.showMarkers(this.locations);
  });
});




  }

  // ✅ Fetch stores from backend
  getStoresFromAPI(): void {
    console.log("Calling API to fetch stores...");

    this.service.getstores().subscribe({
      next: (response: any[]) => {
        console.log("✅ API Response received:", response);

        const geocoder = new google.maps.Geocoder();
        this.allLocations = []; // reset before pushing

        response.forEach((store: any, index: number) => {
          const fullAddress = `${store.street_address}, ${store.city}, ${store.state}, ${store.country}`;
          console.log(`\n🔍 Geocoding store[${index}] address: ${fullAddress}`);

          geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === "OK" && results && results.length > 0) {
              const location = results[0].geometry.location;

              const mappedStore = {
                name: store.store_name,
                address: fullAddress,
                lat: location.lat(),
                lng: location.lng(),
                showHours: false,
                hours: store.working_hours ? JSON.parse(store.working_hours) : null,
              };

              this.allLocations.push(mappedStore);

              // Show all by default
              this.locations = [...this.allLocations];
              this.showMarkers(this.locations);
            } else {
              console.error("❌ Geocode failed for:", store.store_name, "Status:", status);
            }
          });
        });
      },
      error: (err) => {
        console.error("❌ Error fetching stores:", err);
      },
    });
  }

  // ✅ Show markers on map
  showMarkers(locations: any[]) {
    this.clearMarkers();
    const bounds = new google.maps.LatLngBounds();

    locations.forEach((loc) => {
      const marker = new google.maps.Marker({
        map: this.map,
        position: { lat: loc.lat, lng: loc.lng },
        title: loc.name,
      });

      const infowindow = new google.maps.InfoWindow({
        content: `<strong>${loc.name}</strong><br>${loc.address}`,
      });

      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });

      this.markers.push(marker);
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    });

    if (locations.length > 0) {
      this.map.fitBounds(bounds);
    }
  }

  // ✅ Go to single location
  goToLocation(lat: number, lng: number, location: any) {
    this.map.setCenter({ lat, lng });
    this.map.setZoom(16);
    this.toggleHours(location);
  }

  // ✅ Toggle store working hours
  toggleHours(location: any) {
    this.locations.forEach((loc) => {
      loc.showHours = loc === location ? !loc.showHours : false;
    });
  }

  // ✅ Mark specific store
  markStoreOnMap(store: any) {
    const lat = Number(store.lat);
    const lng = Number(store.lng);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("❌ Invalid coordinates:", store.lat, store.lng);
      return;
    }

    this.map.setCenter({ lat, lng });
    this.map.setZoom(16);

    this.clearMarkers();

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: store.name,
      animation: google.maps.Animation.DROP
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<strong>${store.name}</strong><br>${store.address}`
    });

    marker.addListener("click", () => {
      infowindow.open(this.map, marker);
    });

    this.markers.push(marker);
  }

  // ✅ Clear all markers
  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

}
