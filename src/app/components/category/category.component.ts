import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeService } from "../../core/services/home.service";
import { StoreService } from "../../core/services/store.service";
import { Subject, takeUntil, switchMap } from "rxjs";

@Component({
  selector: "app-category",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit, OnDestroy {
  selectedCategoryId: number | null = null;
  categories: any[] = [];

  @Output() categorySelected = new EventEmitter<any>();
  @ViewChild("categoryContainer")
  categoryContainer!: ElementRef<HTMLDivElement>;

  private destroy$ = new Subject<void>();

  constructor(
    private homeService: HomeService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    // 🔹 Load categories initially and whenever store changes
    this.storeService.storeChanged$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.homeService.getCategories())
      )
      .subscribe({
        next: (response) => {
          if (response?.categories) {
            this.categories = response.categories;
          } else {
            this.categories = [];
            console.warn("No categories found");
          }
        },
        error: (err) => {
          console.error("Error fetching categories:", err);
          this.categories = [];
        },
      });
  }

  selectCategory(item: any) {
    this.selectedCategoryId = item.id;
    this.categorySelected.emit(item);
  }

  scrollLeft() {
    this.categoryContainer.nativeElement.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  }

  scrollRight() {
    this.categoryContainer.nativeElement.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
