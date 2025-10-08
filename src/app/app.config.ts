import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import { environment } from '../environments/environment';

// Firebase configuration object - Sie müssen diese Werte von Ihrer Firebase Console erhalten
const firebaseConfig = {
  
          projectId: 'da-notes-a4321',
          appId: '1:853930090073:web:d1045b4d58bcbf77cf9b48',
          storageBucket: 'da-notes-a4321.firebasestorage.app',
          apiKey: 'AIzaSyAgOLWPDos3RgPBtBzpRW749Tqy5Ngi9Lk',
          authDomain: 'da-notes-a4321.firebaseapp.com',
          messagingSenderId: '853930090073',
          measurementId: 'G-V4952P851J',
};

export const appConfig: ApplicationConfig = {
 providers: [
    provideRouter(routes),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideFirestore(() => getFirestore()),
      provideAnalytics(() => getAnalytics()),
    ]),
    ScreenTrackingService,
  ],
};
