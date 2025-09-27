import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  private selectedStoreIdKey = "selectedStoreId";
  private selectedStoreNameKey = "selectedStoreName";

  private storeChangedSubject = new BehaviorSubject<string>("Default Store");
  storeChanged$ = this.storeChangedSubject.asObservable();

  constructor() {
    const name = localStorage.getItem(this.selectedStoreNameKey);
    if (name) {
      this.storeChangedSubject.next(name);
    }
  }

  setSelectedStore(store: { id: number; name: string }) {
    if (!store || store.id === undefined || !store.name) return;
    localStorage.setItem(this.selectedStoreIdKey, store.id.toString());
    localStorage.setItem(this.selectedStoreNameKey, store.name);
    this.storeChangedSubject.next(store.name);
  }

  getSelectedStoreId(): number {
    const id = localStorage.getItem(this.selectedStoreIdKey);
    return id ? Number(id) : -1;
  }

  getSelectedStoreName(): string {
    return this.storeChangedSubject.value || "Default Store";
  }

  clearSelectedStore() {
    localStorage.removeItem(this.selectedStoreIdKey);
    localStorage.removeItem(this.selectedStoreNameKey);
    this.storeChangedSubject.next("Default Store");
  }
}
