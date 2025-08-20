import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { describe, beforeEach, it, expect } from 'vitest';
import { provideRouter } from '@angular/router';
//import { PlatformLocation } from '@angular/common';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        //{ provide: PlatformLocation, useValue: {} },
      ],
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
