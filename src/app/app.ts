import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/authService/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // Injections
  private readonly _authService = inject(AuthService);

  // Life Cycle
  ngOnInit(): void {
    this._authService.changeLoginState();
  }
}
