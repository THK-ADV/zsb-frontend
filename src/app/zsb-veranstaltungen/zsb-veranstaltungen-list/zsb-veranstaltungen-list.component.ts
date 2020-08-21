import {Component, OnInit} from '@angular/core';
import {VeranstaltungService} from '../../shared/veranstaltung.service';

@Component({
  selector: 'app-zsb-veranstaltungen-list',
  templateUrl: './zsb-veranstaltungen-list.component.html',
  styleUrls: ['./zsb-veranstaltungen-list.component.css']
})
export class ZsbVeranstaltungenListComponent implements OnInit {

  constructor(private service: VeranstaltungService) { }

  ngOnInit(): void {
    this.service.getVeranstaltungen().subscribe(list => {
      list.forEach(it => {
        console.log(it);
      });
    });
  }

}
