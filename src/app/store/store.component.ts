import { GoogleMap } from "@angular/google-maps";
import { Component } from "@angular/core";
import { HeaderComponent } from "../component/home/header/header.component";
import { FooterComponent } from "../component/home/footer/footer.component";
import { NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "../shared/breadcrumb/breadcrumb.component";
@Component({
  selector: "app-store",
  imports: [HeaderComponent, FooterComponent, CommonModule, BreadcrumbComponent],
  templateUrl: "./store.component.html",
  styleUrl: "./store.component.scss",
})
export class StoreComponent {
  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  defaultLocations = [
    {
      name: "5411 Yonge St, Toronto ON",
      address: "Yonge St and Byng",
      distance: "1.7km away",
      hours: {
        Sunday: "11:00am–10:00pm",
        Monday: "11:00am–10:00pm",
        Tuesday: "11:00am–10:00pm",
        Wednesday: "11:00am–10:00pm",
        Thursday: "11:00am–10:00pm",
        Friday: "11:00am–12:00am",
        Saturday: "11:00am–12:00am",
      },
      showHours: false,
      lat: 43.654305,
      lng: -79.380068,
    },
    {
      name: "5585 Yonge Street, Toronto ON",
      address: "Yonge and Finch",
      distance: "2.0km away",
      hours: {
        Sunday: "11:00am–10:00pm",
        Monday: "11:00am–10:00pm",
        Tuesday: "11:00am–10:00pm",
        Wednesday: "11:00am–10:00pm",
        Thursday: "11:00am–10:00pm",
        Friday: "11:00am–12:00am",
        Saturday: "11:00am–12:00am",
      },
      showHours: false,
      lat: 43.78,
      lng: -79.4,
    },
    {
      name: "520 Wilson Heights Blvd, Toronto ON",
      address: "Wilson Heights Blvd and Sheppard",
      distance: "3.8km away",
      hours: {
        Sunday: "11:00am–10:00pm",
        Monday: "11:00am–10:00pm",
        Tuesday: "11:00am–10:00pm",
        Wednesday: "11:00am–10:00pm",
        Thursday: "11:00am–10:00pm",
        Friday: "11:00am–12:00am",
        Saturday: "11:00am–12:00am",
      },
      showHours: false,
      lat: 43.75076,
      lng: -79.45626,
    },
    {
      name: "3205 Yonge St, Toronto ON",
      address: "Yonge and Ranleigh",
      distance: "3.8km away",
      hours: {
        Sunday: "11:00am–10:00pm",
        Monday: "11:00am–10:00pm",
        Tuesday: "11:00am–10:00pm",
        Wednesday: "11:00am–10:00pm",
        Thursday: "11:00am–10:00pm",
        Friday: "11:00am–12:00am",
        Saturday: "11:00am–12:00am",
      },
      showHours: false,
      lat: 43.653584,
      lng: -79.379512,
    },
  ];
  locations: any[] = [];
  constructor(private ngZone: NgZone) {}
  toggleHours(location: any) {
    // Hide hours for all other locations
    this.locations.forEach((loc) => {
      if (loc !== location) loc.showHours = false;
    });
    // Toggle for selected location
    location.showHours = !location.showHours;
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
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDpk6Vp36fzxxZu-R_UhM0Qd3W92Urkvos&libraries=places";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
  initMap(): void {
    const defaultLocation = { lat: 43.6532, lng: -79.3832 };
    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: defaultLocation,
        zoom: 13,
      }
    );
    const input = document.getElementById("search-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    this.map.addListener("bounds_changed", () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });
    this.locations = [...this.defaultLocations];
    this.showMarkers(this.defaultLocations);
    searchBox.addListener("places_changed", () => {
      this.ngZone.run(() => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) {
          this.locations = [...this.defaultLocations];
          this.showMarkers(this.defaultLocations);
          return;
        }
        const searchResults: any[] = [];
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;
          searchResults.push({
            name: place.name,
            address: place.formatted_address || place.vicinity || "",
            hours: null,
            showHours: false,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        });
        this.locations = searchResults;
        this.showMarkers(searchResults);
      });
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
      marker.addListener("click", () => {
        infowindow.open(this.map, marker);
      });
      this.markers.push(marker);
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    });
    this.map.fitBounds(bounds);
  }
  goToLocation(lat: number, lng: number, location: any) {
    this.map.setCenter({ lat, lng });
    this.map.setZoom(16);
    this.toggleHours(location);
  }
  clearMarkers(): void {
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }
}
