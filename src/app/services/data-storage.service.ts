import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {

  }
  setUser(user: any) {
    this.storage.set('user', JSON.stringify(user));
  }

  get(name: string): User | null{
    const data = this.storage.get(name);
    if (data){
      return JSON.parse(data);
    } else {
      return null;
    }
  }
}
