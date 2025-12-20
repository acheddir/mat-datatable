import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    provideAnimations(),
  ],
};
