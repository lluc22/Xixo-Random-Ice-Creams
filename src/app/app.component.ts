import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Random Ice Cream', url: '/random', icon: 'dice' },
    { title: 'List Prefrences', url: '/list', icon: 'cog' },
    { title: 'ThreeJS', url: '/three', icon: 'cube' },
  ];
  constructor() {}
}
