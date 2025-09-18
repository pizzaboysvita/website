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

  constructor(
    private ngZone: NgZone,
    private service: HomeService
  ) { }

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

  initMap(): void {
    const defaultLocation = { lat: -40.9006, lng: 174.8860 }; // Center on India for example
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: defaultLocation,
      zoom: 5,
    });

    const input = document.getElementById('search-input') as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    // ✅ Load stores from API instead of defaultLocations
    this.getStoresFromAPI();

    searchBox.addListener('places_changed', () => {
      this.ngZone.run(() => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) {
          this.getStoresFromAPI();
          return;
        }

        const searchResults: any[] = [];
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;
          searchResults.push({
            name: place.name,
            address: place.formatted_address || place.vicinity || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            showHours: false,
            hours: null,
          });
        });

        this.locations = searchResults;
        this.showMarkers(searchResults);
      });
    });
  }

  // ✅ Fetch stores from backend
  getStoresFromAPI(): void {
    console.log("📡 Calling API to fetch stores...");

    this.service.getstores().subscribe({
      next: (response: any[]) => {
        console.log("✅ API Response received:", response);

        const geocoder = new google.maps.Geocoder();

        // Process each store
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

              console.log(`📍 Geocoded Store[${index}]:`, mappedStore);

              // Push to locations array
              this.locations.push(mappedStore);

              // Add marker to map
              this.showMarkers(this.locations);
            } else {
              console.error(" Geocode failed for store:", store.store_name, "Status:", status);
            }
          });
        });
      },
      error: (err) => {
        console.error(" Error fetching stores:", err);
      },
    });
  }


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

  goToLocation(lat: number, lng: number, location: any) {
    this.map.setCenter({ lat, lng });
    this.map.setZoom(16);
    this.toggleHours(location);
  }

  toggleHours(location: any) {
    this.locations.forEach((loc) => {
      loc.showHours = loc === location ? !loc.showHours : false;
    });
  }
  markStoreOnMap(store: any) {
    const lat = Number(store.lat);
    const lng = Number(store.lng);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("❌ Invalid coordinates:", store.lat, store.lng);
      return;
    }

    // Center map
    this.map.setCenter({ lat, lng });
    this.map.setZoom(16);

    // Clear old markers (if you only want one marker)
    this.clearMarkers();

    // Drop marker
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

  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }
}
