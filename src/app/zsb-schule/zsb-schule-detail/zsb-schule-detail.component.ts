import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Schule} from '../schule';

@Component({
  selector: 'app-zsb-schule-detail',
  templateUrl: './zsb-schule-detail.component.html',
  styleUrls: ['./zsb-schule-detail.component.css']
})
export class ZsbSchuleDetailComponent implements OnInit {
  schuleId;
  schule: Schule;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.schuleId = params.get('schuleId');
    });
  }

}
