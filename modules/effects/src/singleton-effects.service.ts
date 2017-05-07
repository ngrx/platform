import { Injectable } from '@angular/core';

@Injectable()
export class SingletonEffectsService {
  private registeredEffects: string[] = [];

  removeExistingAndRegisterNew (effectInstances: any[]): any[] {
    return effectInstances.filter(instance => {
      const instanceAsString = instance.constructor.toString();
      if (this.registeredEffects.indexOf(instanceAsString) === -1) {
        this.registeredEffects.push(instanceAsString);
        return true;
      }
      return false;
    });
  }
}
