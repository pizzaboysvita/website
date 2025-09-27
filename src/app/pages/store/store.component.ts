import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { environment } from "../../../environments/environment";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { HomeService } from "../../core/services/home.service";
import { StoreService } from "../../core/services/store.service";

@Component({
  selector: "app-store",
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.scss"],
})
export class StoreComponent implements OnInit, AfterViewInit, OnDestroy {
  googleMapsApiKey = environment.googleMapsApiKey;
  map: any;
  markers: any[] = [];
  locations: any[] = [];
  allLocations: any[] = [];
  private _searchListener?: () => void;

  constructor(
    private ngZone: NgZone,
    private service: HomeService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    // nothing here — map needs DOM, so initialize after view init
  }

  ngAfterViewInit(): void {
    this.loadGoogleMaps().then(() => {
      this.initMap();
      this.getStoresFromAPI();
      this.setupSearch();
    });
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    if (this._searchListener) {
      const input = document.getElementById(
        "search-input"
      ) as HTMLInputElement | null;
      if (input)
        input.removeEventListener(
          "input",
          this._searchListener as EventListener
        );
    }
  }

  private loadGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  private initMap(): void {
    const defaultCenter = { lat: 17.385044, lng: 78.486671 }; // Hyderabad as default
    this.map = new (window as any).google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: defaultCenter,
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }
    );
  }

  private getStoresFromAPI(): void {
    this.service.getStores().subscribe({
      next: (response: any[]) => {
        const geocoder = new (window as any).google.maps.Geocoder();
        this.allLocations = [];
        response.forEach((store: any) => {
          const mappedStore = {
            id: store.store_id ?? -1, // Ensure store ID is available
            name: store.store_name ?? store.name ?? "Store",
            address:
              store.street_address && store.city
                ? `${store.street_address}, ${store.city}`
                : store.address ?? "",
            lat: store.lat ? Number(store.lat) : null,
            lng: store.lng ? Number(store.lng) : null,
            hours: store.working_hours ? JSON.parse(store.working_hours) : [],
            showHours: false,
          };

          if (!mappedStore.lat || !mappedStore.lng) {
            // Geocode if lat/lng missing
            const fullAddress = `${store.street_address ?? ""}, ${
              store.city ?? ""
            }, ${store.state ?? ""}, ${store.country ?? ""}`;
            geocoder.geocode(
              { address: fullAddress },
              (results: any, status: any) => {
                this.ngZone.run(() => {
                  if (status === "OK" && results.length > 0) {
                    const loc = results[0].geometry.location;
                    mappedStore.lat = loc.lat();
                    mappedStore.lng = loc.lng();
                    this.allLocations.push(mappedStore);
                    this.locations = [...this.allLocations];
                    this.showMarkers(this.locations);
                  } else {
                    console.warn("Geocode failed for:", fullAddress, status);
                  }
                });
              }
            );
          } else {
            this.allLocations.push(mappedStore);
            this.locations = [...this.allLocations];
            this.showMarkers(this.locations);
          }
        });
      },
      error: (err) => console.error("Error fetching stores:", err),
    });
  }

  private showMarkers(locations: any[]): void {
    this.clearMarkers();
    const bounds = new (window as any).google.maps.LatLngBounds();
    locations.forEach((loc) => {
      if (!loc?.lat || !loc?.lng) return;
      const marker = new (window as any).google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: this.map,
        title: loc.name,
      });
      const infowindow = new (window as any).google.maps.InfoWindow({
        content: `<strong>${loc.name}</strong><br>${loc.address}`,
      });
      marker.addListener("click", () => {
        infowindow.open(this.map, marker);
        this.ngZone.run(() => this.toggleHours(loc));
      });
      this.markers.push(marker);
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    });
    if (locations.length > 0) this.map.fitBounds(bounds);
  }

  private clearMarkers(): void {
    this.markers.forEach((m) => {
      try {
        m.setMap(null);
      } catch (e) {}
    });
    this.markers = [];
  }

  // Save store selection
  goToLocation(lat: number, lng: number, store: any): void {
    if (!this.map) return;
    this.map.setCenter({ lat, lng });
    this.map.setZoom(15);
    this.toggleHours(store);

    // Save selected store via StoreService
    this.storeService.setSelectedStore({ id: store.id, name: store.name });
    console.log("Selected store saved:", store.id, store.name);
  }

  toggleHours(store: any): void {
    this.locations.forEach((loc) => {
      loc.showHours = loc === store ? !loc.showHours : false;
    });
  }

  private setupSearch(): void {
    const input = document.getElementById("search-input") as HTMLInputElement;
    if (!input) return;
    const handler = () => {
      this.ngZone.run(() => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
          this.locations = [...this.allLocations];
        } else {
          this.locations = this.allLocations.filter(
            (s) =>
              (s.name && this.isSimilar(s.name, q)) ||
              (s.address && this.isSimilar(s.address, q))
          );
        }
        this.showMarkers(this.locations);
      });
    };
    input.addEventListener("input", handler);
    this._searchListener = handler;
  }

  private isSimilar(str: string, query: string): boolean {
    if (!str || !query) return false;
    str = str.toLowerCase();
    query = query.toLowerCase();
    return str.includes(query) || str.includes(query.substring(0, 2));
  }
}
