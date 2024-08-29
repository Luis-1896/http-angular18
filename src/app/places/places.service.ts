import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Something went wrong fetching the available places. Please try again later.'
    );
  }

  loadUserPlaces() {}

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((resData) => resData.places),
      catchError((error) => {
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
