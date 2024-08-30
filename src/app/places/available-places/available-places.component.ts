import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import type { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');

  private placesServices = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.placesServices.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error: (err: Error) => {
        console.log(err);
        this.error.set(err.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPace: Place) {
    const subscription = this.placesServices
      .addPlaceToUserPlaces(selectedPace)
      .subscribe({
        next: (resData) => console.log(resData),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
