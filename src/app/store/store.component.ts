import { GoogleMap } from "@angular/google-maps";
import { Component } from "@angular/core";
import { HeaderComponent } from "../component/home/header/header.component";
import { FooterComponent } from "../component/home/footer/footer.component";
import { NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-store",
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: "./store.component.html",
  styleUrl: "./store.component.scss",
})
export class StoreComponent {
  map!: google.maps.Map;
  markers: google.maps.Marker[] = [];
  defaultLocations = [
    {
      name: "Elgandal Fort",
      address: "About 16 km from Karimnagar on Manair River",
      distance: "336.4km away",
      hours: {
        Wednesday: "11:00am–10:00pm",
        Thursday: "11:00am–10:00pm",
        Friday: "11:00am–12:00am",
        Saturday: "11:00am–12:00am",
        Sunday: "11:00am–10:00pm",
        Monday: "11:00am–10:00pm",
        Tuesday: "11:00am–10:00pm",
      },
      showHours: false,
      lat: 18.436,
      lng: 79.124,
    },
    {
      name: "Lower Manair Dam",
      address: "On Manair River, ~6 km from Karimnagar town",
      hours: {
        Wednesday: "9:00am–7:00pm",
        Thursday: "9:00am–7:00pm",
        Friday: "9:00am–7:00pm",
        Saturday: "9:00am–7:00pm",
        Sunday: "9:00am–7:00pm",
        Monday: "Closed",
        Tuesday: "9:00am–7:00pm",
      },
      showHours: false,
      lat: 18.4,
      lng: 79.13,
    },
    {
      name: "Karimnagar Cable Bridge",
      address: "Spanning Manair River near the city",
      hours: {
        Wednesday: "Open 24 hours",
        Thursday: "Open 24 hours",
        Friday: "Open 24 hours",
        Saturday: "Open 24 hours",
        Sunday: "Open 24 hours",
        Monday: "Open 24 hours",
        Tuesday: "Open 24 hours",
      },
      showHours: false,
      lat: 18.433,
      lng: 79.143,
    },
    {
      name: "Nagunur Fort",
      address: "Ruins and temples, ~10 km north of Karimnagar",
      hours: {
        Wednesday: "10:00am–5:00pm",
        Thursday: "10:00am–5:00pm",
        Friday: "10:00am–5:00pm",
        Saturday: "10:00am–5:00pm",
        Sunday: "10:00am–5:00pm",
        Monday: "Closed",
        Tuesday: "10:00am–5:00pm",
      },
      showHours: false,
      lat: 18.525,
      lng: 79.125,
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
    const defaultLocation = { lat: 18.4386, lng: 79.1288 };
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
