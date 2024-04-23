import { Component, input } from '@angular/core';
@Component({
  selector: 'loader',
  template: ` @if (isLoading()) {
    <div class="loader-container">
      <div class="spinner"></div>
      <p>Generating pdfs for each role type...</p>
    </div>
    }`,
  standalone: true,
  styles: [
    `
      .loader-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        z-index: 1000; /* high z-index to ensure it covers other content */
        p {
          color: white;
          font-size: 1.5rem;
          margin-left: 10px;
        }
      }

      .spinner {
        border: 6px solid #f3f3f3;
        border-radius: 50%;
        border-top: 6px solid #3498db;
        width: 50px;
        height: 50px;
        animation: spin 2s linear infinite;
        margin-bottom: 20px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {
  isLoading = input(false);
}
