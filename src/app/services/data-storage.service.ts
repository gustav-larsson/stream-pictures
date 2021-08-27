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

  get(name: string): any | null{
    const data = this.storage.get(name);
    return data;
  }
  getUser(): User | null{
    const data = this.storage.get('user');
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
  setMerchant(merchant: any) {
    this.storage.set('merchant', JSON.stringify(merchant))
  }
  getMerchant() {
    const data = this.storage.get('merchant');
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
  set(key: string, value: string) {
    this.storage.set(key, value);
  }
  remove(name: string): void {
    this.storage.remove(name);
  }

  removeUser(): void {
    this.storage.remove('user');
  }
}
