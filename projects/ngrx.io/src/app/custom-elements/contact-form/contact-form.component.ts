import { Component } from '@angular/core';
import {addDoc, collection, Firestore} from '@angular/fire/firestore/lite';

@Component({
    selector: 'ngrx-contact-form',
    styles: [
        `
        :host {
            display: block;
            margin: 20px auto;
            max-width: 500px;
        }
        form {
            display: flex;
            flex-direction: column;
        }
        button {
                align-self: end;
            }
        `
    ],
    template: `
      <form *ngIf="!emailSent else thankYou" #contactForm="ngForm" (ngSubmit)="submit(contactForm.value)">
        <mat-form-field class="example-full-width" appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput required ngModel name="fromName" placeholder="Enter your name">
        </mat-form-field>
        <mat-form-field class="example-full-width" appearance="fill">
          <mat-label>Email</mat-label>
          <input type="email" matInput ngModel email name="email" required placeholder="Enter your email">
        </mat-form-field>
        <mat-form-field class="example-full-width" appearance="fill">
          <mat-label>Message</mat-label>
          <textarea type="text" matInput ngModel name="body" required placeholder="Type your message" rows="10"></textarea>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!contactForm.valid">Send</button>
        <div *ngIf="error" class="alert is-critical">
          <p>Error sending email</p>
          <p>{{error}}</p>
        </div>
      </form>
      <ng-template #thankYou>
        <div class="alert is-helpful">
          <p>Thank you for reaching out.</p>
          <p>Our team would respond promptly.</p>
        </div>
      </ng-template>
    `
})

export class ContactFormComponent {
    protected emailSent = false;
    protected error: unknown;

    constructor(private readonly firestore: Firestore ) { }

    submit(contact: {
        fromName: string;
        email: string;
        body: string;
    }) {
        addDoc(collection(this.firestore, 'mail'), {
            to: ['info@ts.dev', 'hello+ngrx@liveloveapp.com'],
            from: contact.email,
            replyTo: [contact.email, 'info@ts.dev', 'hello+ngrx@liveloveapp.com'],
            message: {
                subject: 'NgRx Enterprise Support inquiry',
                text: `${contact.body}\n${contact.fromName}`
            }
        }).then(
            () => this.emailSent = true,
            (e) => this.error = e,
        )
    }

}
