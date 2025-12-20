import { Component } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { BasicExampleComponent } from "./examples/basic/basic-example.component";
import { ClientSideExampleComponent } from "./examples/client-side/client-side-example.component";
import { ServerSideExampleComponent } from "./examples/server-side/server-side-example.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    MatTabsModule,
    BasicExampleComponent,
    ClientSideExampleComponent,
    ServerSideExampleComponent,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  public title = "Material Datatable Demo";
}
