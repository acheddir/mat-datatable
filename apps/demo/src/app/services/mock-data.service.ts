import { Injectable } from "@angular/core";
import { Observable, delay, of } from "rxjs";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class MockDataService {
  public generateProducts(count = 50): Product[] {
    const categories = ["Electronics", "Clothing", "Food", "Books", "Sports", "Home & Garden"];
    const products: Product[] = [];

    for (let i = 1; i <= count; i++) {
      const product = new Product();
      product.id = i;
      product.name = `Product ${String(i)}`;
      product.category = categories[Math.floor(Math.random() * categories.length)];
      product.price = Math.floor(Math.random() * 1000) + 10;
      product.stock = Math.floor(Math.random() * 100);
      product.available = product.stock > 0;
      product.discount = Math.random() > 0.5 ? Math.random() * 0.3 : 0;
      product.lastUpdated = new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      );

      products.push(product);
    }

    return products;
  }

  public generateUsers(count = 30): User[] {
    const roles = ["Admin", "User", "Manager", "Developer"];
    const statuses = ["Active", "Inactive", "Pending"];
    const users: User[] = [];

    for (let i = 1; i <= count; i++) {
      const user = new User();
      user.id = i;
      user.name = `User ${String(i)}`;
      user.email = `user${String(i)}@example.com`;
      user.role = roles[Math.floor(Math.random() * roles.length)];
      user.status = statuses[Math.floor(Math.random() * statuses.length)];
      user.joinDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);

      users.push(user);
    }

    return users;
  }

  // Simulate server-side data fetching with pagination, sorting, and filtering
  public getProductsServerSide(params: {
    page: number;
    pageSize: number;
    sortField?: string;
    sortDirection?: "asc" | "desc";
  }): Observable<{ data: Product[]; totalCount: number }> {
    const allProducts = this.generateProducts(100);

    // Simulate server delay
    return of({
      data: allProducts.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize),
      totalCount: allProducts.length,
    }).pipe(delay(500)); // Simulate network delay
  }

  public getUsersServerSide(params: {
    page: number;
    pageSize: number;
    sortField?: string;
    sortDirection?: "asc" | "desc";
  }): Observable<{ data: User[]; totalCount: number }> {
    const allUsers = this.generateUsers(50);

    return of({
      data: allUsers.slice(params.page * params.pageSize, (params.page + 1) * params.pageSize),
      totalCount: allUsers.length,
    }).pipe(delay(500));
  }
}
