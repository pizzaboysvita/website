import { Component, OnInit, NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HomeService } from "../../core/services/home.service";
import { StoreService } from "../../core/services/store.service";

@Component({
  selector: "app-storemodal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./storemodal.component.html",
  styleUrls: ["./storemodal.component.scss"],
})
export class StoreModalComponent implements OnInit {
  stores: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private service: HomeService,
    public storeService: StoreService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.service.getStores().subscribe({
      next: (response: any[]) => {
        this.stores = response.map((store) => ({
          id: store.store_id ?? -1,
          name: store.store_name ?? "Store",
        }));
      },
      error: (err) => console.error(err),
    });
  }

  selectStore(store: any) {
    console.log("Selected store:", store);
    
    const storeId = store.id ?? -1;
    const storeName = store.name ?? "Default Store";
    this.storeService.setSelectedStore({ id: storeId, name: storeName });
    this.activeModal.close();
  }
}
