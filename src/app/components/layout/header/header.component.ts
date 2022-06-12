import { Component, OnInit } from '@angular/core';
import { AppRoutes } from '@constants/routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  get appRoutes(): typeof AppRoutes {
    return AppRoutes;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
