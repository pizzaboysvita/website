import { Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from "@angular/router";
import { CommonModule } from "@angular/common";
import { filter } from "rxjs/operators";
interface Breadcrumb {
  label: string;
  url: string;
}
@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    // Rebuild on navigation end
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.build(this.route);
      });
    // Build once on init
    this.breadcrumbs = this.build(this.route);
  }
  private build(route: ActivatedRoute): Breadcrumb[] {
    const crumbs: Breadcrumb[] = [{ label: "Home", url: "/" }];
    let current = route.root;
    let url = "";
    while (current.firstChild) {
      current = current.firstChild;
      const snap = current.snapshot;
      const segment = snap.url.map((s) => s.path).join("/");
      if (segment) url += `/${segment}`;
      const label = snap.data?.["breadcrumb"] as string | undefined;
      if (label) {
        crumbs.push({ label, url });
      }
    }
    return crumbs;
  }
}
