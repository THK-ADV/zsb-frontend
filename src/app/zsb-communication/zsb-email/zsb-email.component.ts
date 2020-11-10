import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'app-zsb-email',
  templateUrl: './zsb-email.component.html',
  styleUrls: ['./zsb-email.component.css']
})
export class ZsbEmailComponent implements OnInit {

  public addresseesIds: string[] = []

  constructor() {
  }

  ngOnInit(): void {
  }

}
