import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataStorageService } from '../services/data-storage.service';
import { TwitchCommunicationService } from '../services/twitch-communcation.service';

@Injectable({ providedIn: 'root' })
export class TwitchValidators {
  constructor(
    private twitch: TwitchCommunicationService,
    private store: DataStorageService) {}

  isSubbed() {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.store.getUser()?.twitchId === control.value.id || '56723520' === this.store.getUser()?.twitchId ? of(null) : this.twitch.isUserSubbed(control.value.id)?.pipe(
        map((isSub: any) => (isSub.data[0].tier === '1000' ? null : { notSubbed: true })),
        catchError(() => of({ networkError: true })));
    }
  }
}

