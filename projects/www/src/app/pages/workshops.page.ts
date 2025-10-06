import { Component } from '@angular/core';
import { StyledBoxComponent } from '../components/styled-box.component';

@Component({
  selector: 'ngrx-workshops-page',
  imports: [StyledBoxComponent],
  template: `
    <div class="banner"></div>

    <div class="article-width">
      <h1>Workshops</h1>
      <p>
        Are you struggling to maintain and enhance your existing Angular
        applications? Do you want to harness the power of NgRx for state
        management and explore the cutting-edge features in Angular? Join us for
        transformative workshops that will empower you to architect and
        modernize your apps with confidence!
      </p>

      <p>
        Take your Angular knowledge to the next level with participating NgRx
        team members.
      </p>

      <h2>Highlights</h2>
    </div>
    <div class="features">
      <ngrx-styled-box>
        <h3>Architectural Excellence</h3>
        <p>
          Learn the art of crafting scalable, maintainable, and robust Angular
          applications. We'll delve deep into architectural patterns, best
          practices, and tools to structure your apps for success.
        </p>
      </ngrx-styled-box>
      <ngrx-styled-box>
        <h3>NgRx for State Management</h3>
        <p>
          Gain a comprehensive understanding of NgRx, the go-to library for
          managing state in Angular apps. We'll explore actions, reducers,
          effects, and selectors to create a robust state management system and
          how it influences app architecture.
        </p>
      </ngrx-styled-box>
      <ngrx-styled-box>
        <h3>Introduction to Signals</h3>
        <p>
          Signals or NgRx? They work well together. Dive into one of Angular's
          most exciting features – Signals. Discover how Signals can streamline
          communication within your application, making it more responsive,
          efficient, and user-friendly.
        </p>
      </ngrx-styled-box>
      <ngrx-styled-box>
        <h3>NgRx SignalStore</h3>
        <p>
          Explore a cutting-edge state management solution with native support
          for Angular Signals. From foundational concepts to advanced
          techniques, learn how to leverage SignalStore's robust and extensible
          design to efficiently manage application state.
        </p>
      </ngrx-styled-box>
      <ngrx-styled-box>
        <h3>State Management Patterns</h3>
        <p>
          Understand the distinctions between local and global state as a
          prerequisite for developing well-designed applications that are easy
          to maintain and scale.
        </p>
      </ngrx-styled-box>
      <ngrx-styled-box>
        <h3>Migration Strategies</h3>
        <p>
          If you have an existing Angular application, we'll guide you through
          effective strategies for migrating to the latest version of Angular
          while improving your app's architecture.
        </p>
      </ngrx-styled-box>
    </div>

    <div class="article-width">
      <h2>Agenda</h2>
      <p>
        Choose one, two, or three full days of the
        <em>NgRx and Modern Angular Architectures Workshop</em> that covers the
        basics of NgRx to the most advanced topics. Whether your teams are just
        starting with NgRx or have been using it for a while - they are
        guaranteed to learn new concepts during this workshop.
      </p>
      <div class="agenda">
        <div class="day">
          <h4>Day 1</h4>
          <h3>NgRx Essentials</h3>
          <ul>
            <li>NgRx Store</li>
            <li>Actions</li>
            <li>Reducers</li>
            <li>Selectors</li>
            <li>Feature State</li>
            <li>Functional and Class-Based Effects</li>
            <li>Error Handling</li>
          </ul>
        </div>
        <div class="day">
          <h4>Day 2</h4>
          <h3>Advanced NgRx</h3>
          <ul>
            <li>Optimistic and Pessimistic Updates</li>
            <li>Managing Request Status</li>
            <li>Router Store</li>
            <li>Feature Creator</li>
            <li>Combining Selectors</li>
            <li>View Models</li>
            <li>Entities</li>
          </ul>
        </div>
        <div class="day">
          <h4>Day 3</h4>
          <h3>NgRx SignalStore</h3>
          <ul>
            <li>Introduction to Signals</li>
            <li>SignalState</li>
            <li>SignalStore</li>
            <li>Custom Store Features</li>
            <li>RxJS Integration</li>
            <li>Entities</li>
            <li>Global and Local State Management Patterns</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .banner {
        width: 100%;
        height: 400px;
        background-image: url('/images/marketing/workshops/header.jpg');
        background-position: center;
        background-size: cover;
      }

      .article-width {
        max-width: 960px;
        margin: 0 auto;
      }

      ngrx-styled-box {
        padding: 16px 24px 24px;
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
        padding: 24px;
      }

      .agenda {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 16px 0;
      }

      .agenda .day {
        display: block;
        padding: 24px;
      }

      .agenda .day:nth-child(1) {
        background-color: rgba(170, 27, 182, 0.06);
      }

      .agenda .day:nth-child(2) {
        background-color: rgba(170, 27, 182, 0.18);
      }

      .agenda .day:nth-child(3) {
        background-color: rgba(170, 27, 182, 0.3);
      }

      .agenda h4 {
        text-transform: uppercase;
        color: #fface6;
        margin-bottom: 0;
      }

      .agenda h3 {
        margin-top: 2px;
      }

      .agenda ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    `,
  ],
})
export default class WorkshopsPageComponent {}
