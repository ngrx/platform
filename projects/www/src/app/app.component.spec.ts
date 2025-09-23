import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { describe, beforeEach, it, expect } from 'vitest';
import { provideRouter } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
      imports: [AppComponent],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
