import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {DataTableItem, ZsbSchuleListDatasource} from './zsb-schule-list-datasource';
import {DatabaseService} from '../database.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './zsb-schule-list.component.html',
  styleUrls: ['./zsb-schule-list.component.css']
})
export class ZsbSchuleListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<DataTableItem>;
  dataSource: ZsbSchuleListDatasource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'name',
    'schulform',
    'schwerpunkt',
    'adresse',
    'ort',
    'schulleitung_mail',
    // 'stubo_mail',
    // 'schueleranzahl',
    // 'kooperationsvertrag',
    // 'kaoa_hochschule',
    // 'talent',
    'edit',
    'delete'
  ];

  constructor(private service: DatabaseService) {
  }

  ngOnInit() {
    this.dataSource = new ZsbSchuleListDatasource(this.service, this);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
