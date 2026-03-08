import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StyledBoxComponent } from '../components/styled-box.component';

@Component({
  selector: 'ngrx-workshops-page',
  imports: [StyledBoxComponent, RouterLink],
  template: `
    <div class="article-width">
      <h1>Workshops</h1>

      <p>
        Are you struggling to maintain and enhance your existing Angular
        applications? Do you want to harness the power of NgRx for state
        management and explore the cutting-edge features in Angular? Join us for
        in-depth workshops that will empower you to architect and modernize your
        apps with confidence!
      </p>

      <p>
        Take your Angular knowledge to the next level with
        <a routerLink="." fragment="team">participating NgRx team members</a>.
      </p>

      <a routerLink="." fragment="upcoming" class="cta-button">
        View upcoming dates ↓
      </a>

      <h2>
        Enterprise Angular Architectures with NgRx, Signals, and AI Assistants
      </h2>

      <p>
        In the ever-evolving world of web development, staying ahead is crucial.
        This workshop offers a hands-on approach to mastering architecture and
        state management in Angular applications using both traditional NgRx
        patterns and the modern Signal-based approach. It is designed for
        developers, architects, and teams who want to revamp their existing
        Angular applications, leverage the latest advancements in Angular and
        NgRx ecosystems, and learn how to collaborate effectively with AI
        assistants to implement predictable state management logic.
      </p>

      <h2>Workshop Highlights</h2>

      <div class="features">
        <ngrx-styled-box>
          <h3>Architectural Excellence</h3>
          <p>
            Learn how to design scalable and maintainable Angular applications
            using proven architectural patterns. We will explore how to
            structure applications, organize state management logic, and make
            architectural decisions that support long-term sustainability.
          </p>
        </ngrx-styled-box>
        <ngrx-styled-box>
          <h3>Global NgRx Store</h3>
          <p>
            Master the powerful state management solution for complex Angular
            applications. Learn how actions, reducers, effects, and selectors
            work together to create a robust global state architecture that
            scales with your application needs.
          </p>
        </ngrx-styled-box>
        <ngrx-styled-box>
          <h3>Angular Signals</h3>
          <p>
            Gain an in-depth understanding of Angular's powerful reactivity
            system. Learn how to leverage Signals to create efficient
            applications while maintaining clean, readable code and optimal
            performance.
          </p>
        </ngrx-styled-box>
        <ngrx-styled-box>
          <h3>NgRx SignalStore</h3>
          <p>
            Explore the fastest-growing state management solution in the Angular
            ecosystem. From foundational concepts to advanced techniques, learn
            how to leverage SignalStore's robust and extensible design to
            efficiently manage application state.
          </p>
        </ngrx-styled-box>
        <ngrx-styled-box>
          <h3>State Management Patterns</h3>
          <p>
            Understand when and how to apply local and global state management
            strategies. Learn how to clearly separate responsibilities between
            different layers of application state to build maintainable
            architectures.
          </p>
        </ngrx-styled-box>
        <ngrx-styled-box>
          <h3>AI-Assisted Development</h3>
          <p>
            Discover how to collaborate effectively with modern AI assistants to
            accelerate development without sacrificing architectural clarity.
            Through practical examples, learn how structured prompts and
            reusable AI skills can help generate predictable and maintainable
            state management logic.
          </p>
        </ngrx-styled-box>
      </div>

      <h2>Agenda</h2>

      <div class="agenda">
        <div class="day">
          <div class="day-header">
            <h4>Day 1</h4>
            <h3>Global Store Foundation</h3>
          </div>
          <ul>
            <li>Introduction to State Management and Redux Architecture</li>
            <li>Building Blocks: Actions, Reducers, and Selectors</li>
            <li>Modern Store Features: Action Group and Feature Creators</li>
            <li>Effects Management: Functional and Class-Based Approach</li>
            <li>
              Enhancing DX: Leveraging Devtools, Router Store, and Entities
            </li>
            <li>Store Testing: Validating Predictable Application Behavior</li>
          </ul>
        </div>
        <div class="day">
          <div class="day-header">
            <h4>Day 2</h4>
            <h3>Signals and SignalStore</h3>
          </div>
          <ul>
            <li>Angular Signals: Core Concepts and Benefits</li>
            <li>
              Signal Extensions: Deep Signals, SignalState, and SignalMethod
            </li>
            <li>State Manipulation: Building Custom Updaters</li>
            <li>Bridging Worlds: RxJS Integration with Signals</li>
            <li>SignalStore: Core Concepts and Architecture</li>
            <li>
              State Management Patterns: Local and Global State Strategies
            </li>
          </ul>
        </div>
        <div class="day">
          <div class="day-header">
            <h4>Day 3</h4>
            <h3>Advanced SignalStore and AI Assistants</h3>
          </div>
          <ul>
            <li>SignalStore Extensibility: Building Custom Store Features</li>
            <li>
              Entity Management: Working with Collections Using the Entities
              Plugin
            </li>
            <li>
              Resource Integration: Managing Data Fetching with Angular
              Resources
            </li>
            <li>
              Event-Based Workflows: Coordinating Complex Logic with the Events
              Plugin
            </li>
            <li>
              Testing SignalStore: Best Practices for Reliable Store Logic
            </li>
            <li>
              AI-Assisted Development: Using Skills to Generate Predictable
              State Management Logic
            </li>
          </ul>
        </div>
      </div>

      <h2>Flexible Attendance Options</h2>

      <p>Choose the workshop option that best fits your team's needs:</p>

      <ul>
        <li>
          <strong>Full NgRx Experience:</strong> Attend all three days to learn
          NgRx from basics to the most advanced topics!
        </li>
        <li>
          <strong>Traditional NgRx:</strong> Day 1 focuses on the proven
          patterns of global state management with NgRx Store.
        </li>
        <li>
          <strong>SignalStore Bundle:</strong> Days 2 and 3 explore the exciting
          world of Signal-based state management and AI-assisted development.
        </li>
      </ul>

      <p>
        All days are designed to be independent and can be attended separately,
        although the complete three-day workshop provides the most comprehensive
        learning experience.
      </p>

      <h2 id="upcoming">Upcoming Workshops</h2>

      <div class="upcoming">
        <div class="workshop-item">
          <div class="workshop-meta">
            <span class="workshop-date">May 13&ndash;15, 2026</span>
            <span class="workshop-tz">US-friendly timezone</span>
            <span class="workshop-time">
              Start time: 8 AM (PT) / 11 AM (ET)
            </span>
            <span class="workshop-duration">8 hours / day</span>
          </div>
          <a
            href="https://ti.to/ngrx/workshop-may-2025-us?source=ngrx_io"
            target="_blank"
            class="workshop-register"
          >
            Register
          </a>
        </div>
        <div class="workshop-item">
          <div class="workshop-meta">
            <span class="workshop-date">May 20&ndash;22, 2026</span>
            <span class="workshop-tz">EU-friendly timezone</span>
            <span class="workshop-time">Start time: 10 AM (CET)</span>
            <span class="workshop-duration">8 hours / day</span>
          </div>
          <a
            href="https://ti.to/ngrx/workshop-may-2025-eu?source=ngrx_io"
            target="_blank"
            class="workshop-register"
          >
            Register
          </a>
        </div>
      </div>

      <h2 id="team">Participating NgRx Team Members</h2>

      <div class="team">
        <div class="member">
          <div class="member-photo">
            <img src="/images/bios/alex-okrushko.jpg" alt="Alex Okrushko" />
          </div>
          <div class="member-info">
            <h3>Alex Okrushko</h3>
            <div class="member-bio">
              Alex Okrushko is a core member of the NgRx team, a Google
              Developer Expert in Angular, an AngularToronto organizer, and a
              co-organizer of the official
              <a href="https://discord.gg/angular" target="_blank"
                >Angular Discord</a
              >.
              <p>
                Alex has been contributing to NgRx since 2018. Among his
                contributions are creator factories (such as
                <code>createAction()</code> and <code>createReducer()</code>),
                the overall type strictness of the NgRx code and the
                introduction of the <code>&#64;ngrx/component-store</code>
                library.
              </p>
              <p>
                Over the last 17 years Alex worked at companies such as Google,
                Cisco and Snowflake where he built modern web apps, processes
                and teams.
              </p>
              <p>
                In his free time, he loves to learn and share the knowledge,
                provides NgRx workshops, and helps with
                <a href="https://ts.dev/style" target="_blank">ts.dev/style</a>
                - the popular TypeScript style guide.
              </p>
            </div>
          </div>
        </div>

        <div class="member">
          <div class="member-photo">
            <img src="/images/bios/marko.jpg" alt="Marko Stanimirović" />
          </div>
          <div class="member-info">
            <h3>Marko Stanimirović</h3>
            <div class="member-bio">
              Marko Stanimirović is a core member of the NgRx team (contributing
              since 2020), a Google Developer Expert in Angular, and a
              co-organizer of the NG Belgrade conference.
              <p>
                Marko's contributions include <code>createFeature()</code>,
                <code>createActionGroup()</code>, functional effects, an
                overhaul of the <code>&#64;ngrx/component</code> library, and
                continuous maintenance of the NgRx platform. He is also a lead
                author of the <code>&#64;ngrx/signals</code> library.
              </p>
              <p>
                He enjoys contributing to open-source software, sharing
                knowledge through technical articles and talks, and playing
                guitar.
              </p>
              <p>
                Marko holds a Master of Science in Software Engineering from the
                University of Belgrade.
              </p>
            </div>
          </div>
        </div>

        <div class="member">
          <div class="member-photo">
            <img src="/images/bios/rainer.jpg" alt="Rainer Hahnekamp" />
          </div>
          <div class="member-info">
            <h3>Rainer Hahnekamp</h3>
            <div class="member-bio">
              Rainer Hahnekamp is a core member of the NgRx team (contributing
              since 2023), a Google Developer Expert in Angular, a trainer and
              consultant in the Angular Architects expert network, and the
              author of ng-news, a weekly Angular newsletter.
              <p>
                His work on the <code>&#64;ngrx/signals</code> package spans
                several key features, including <code>signalMethod()</code>,
                <code>withLinkedState()</code>, and <code>withFeature()</code>,
                alongside continuous maintenance of the NgRx platform. Rainer
                also maintains NgRx Toolkit, a community-driven collection of
                plugins for NgRx SignalStore.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2>Contact Us</h2>

      <p>
        Are you interested in a dedicated in-person or online workshop for your
        team? Any questions about the workshops? Please reach out to us directly
        at
        <a href="mailto:marko@ngrx.io">marko&#64;ngrx.io</a>.
      </p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 0 24px 24px;

        @media only screen and (max-width: 1280px) {
          padding-top: 62px;
        }
      }

      .article-width {
        max-width: 960px;
        margin: 0 auto;
      }

      .cta-button {
        display: inline-block;
        margin: 24px 0 24px;
        padding: 12px 28px;
        border-radius: 8px;
        background-color: rgba(170, 27, 182, 0.15);
        border: 1px solid rgba(170, 27, 182, 0.35);
        color: var(--ngrx-link);
        font-weight: 600;
        font-size: 1rem;
        text-decoration: none;
        transition:
          background-color 0.15s ease,
          border-color 0.15s ease;
      }

      .cta-button:hover {
        background-color: rgba(170, 27, 182, 0.25);
        border-color: rgba(170, 27, 182, 0.55);
      }

      ngrx-styled-box {
        padding: 16px 24px 24px;
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
        margin: 24px 0;
      }

      .agenda {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px 0;
      }

      .agenda .day {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 0 32px;
        padding: 24px 28px;
        border-radius: 8px;
        border-left: 4px solid rgba(170, 27, 182, 0.5);
      }

      .agenda .day:nth-child(1) {
        background-color: rgba(170, 27, 182, 0.06);
        border-left-color: rgba(170, 27, 182, 0.3);
      }

      .agenda .day:nth-child(2) {
        background-color: rgba(170, 27, 182, 0.12);
        border-left-color: rgba(170, 27, 182, 0.5);
      }

      .agenda .day:nth-child(3) {
        background-color: rgba(170, 27, 182, 0.2);
        border-left-color: rgba(170, 27, 182, 0.7);
      }

      .agenda .day-header {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 4px;
        border-right: 1px solid rgba(170, 27, 182, 0.2);
        padding-right: 32px;
      }

      .agenda h4 {
        text-transform: uppercase;
        color: var(--ngrx-link);
        margin: 0 0 6px;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
      }

      .agenda h3 {
        margin: 0;
        font-size: 1rem;
        line-height: 1.4;
      }

      .agenda ul {
        padding: 0 0 0 20px;
        margin: 0;
        line-height: 1.8;
      }

      @media only screen and (max-width: 640px) {
        .agenda .day {
          grid-template-columns: 1fr;
        }

        .agenda .day-header {
          border-right: none;
          border-bottom: 1px solid rgba(170, 27, 182, 0.2);
          padding-right: 0;
          padding-bottom: 12px;
          margin-bottom: 12px;
        }
      }

      .upcoming {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px 0;
      }

      .workshop-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 20px 28px;
        border-radius: 8px;
        border-left: 4px solid rgba(170, 27, 182, 0.5);
        background-color: rgba(170, 27, 182, 0.06);
      }

      .workshop-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 8px;
      }

      .workshop-date {
        flex: 0 0 100%;
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 2px;
      }

      .workshop-tz,
      .workshop-time,
      .workshop-duration {
        font-size: 0.8rem;
        padding: 2px 10px;
        border-radius: 20px;
        background-color: rgba(170, 27, 182, 0.1);
        border: 1px solid rgba(170, 27, 182, 0.2);
        color: var(--ngrx-link);
        opacity: 0.85;
      }

      .workshop-register {
        flex-shrink: 0;
        display: inline-block;
        padding: 8px 20px;
        border-radius: 6px;
        background-color: rgba(170, 27, 182, 0.15);
        color: var(--ngrx-link);
        font-weight: 600;
        font-size: 0.875rem;
        text-decoration: none;
        border: 1px solid rgba(170, 27, 182, 0.3);
        transition:
          background-color 0.15s ease,
          border-color 0.15s ease;
      }

      .workshop-register:hover {
        background-color: rgba(170, 27, 182, 0.25);
        border-color: rgba(170, 27, 182, 0.5);
      }

      @media only screen and (max-width: 640px) {
        .workshop-item {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .team {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 16px 0;
      }

      .member {
        display: grid;
        grid-template-columns: 160px 1fr;
        gap: 32px;
        align-items: start;
        padding: 28px;
        border-radius: 8px;
        background-color: rgba(170, 27, 182, 0.06);
        border-left: 4px solid rgba(170, 27, 182, 0.35);
      }

      .member-photo {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        border: 3px solid rgba(170, 27, 182, 0.3);
      }

      .member-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        display: block;
      }

      .member-info h3 {
        margin: 0 0 12px;
        font-size: 1.2rem;
      }

      .member-bio {
        line-height: 1.7;
        font-size: 0.95rem;
      }

      .member-bio p {
        margin: 10px 0 0;
      }

      @media only screen and (max-width: 640px) {
        .member {
          grid-template-columns: 1fr;
        }

        .member-photo {
          width: 120px;
          height: 120px;
        }
      }
    `,
  ],
})
export default class WorkshopsPageComponent {}
