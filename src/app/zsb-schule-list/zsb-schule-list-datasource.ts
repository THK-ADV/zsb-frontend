import {DataSource} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {map} from 'rxjs/operators';
import {merge, Observable, of as observableOf} from 'rxjs';
import {Schule} from '../zsb-schule/schule';
import {DatabaseService} from '../database.service';
import {ZsbSchuleListComponent} from './zsb-schule-list.component';

// tslint:disable-next-line:no-empty-interface
export interface DataTableItem extends Schule {
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DataTableItem[] = [
  {
    schule_id: 1,
    name: 'TU Wien',
    schulform: 'Hochschule',
    schwerpunkt: 'Studenten',
    kooperationsvertrag: false,
    adress_id: 1,
    adresse: undefined,
    schulleitung_mail: '2minutes@tu-wien.de',
    stubo_mail: 'info@tu-wien.de',
    schueleranzahl: 20,
    kaoa_hochschule: false,
    talenscouting: true,
    ort: undefined
  },
  {
    schule_id: 5,
    name: 'RWTH Achen',
    schulform: 'Hochschule',
    schwerpunkt: 'Studenten',
    kooperationsvertrag: false,
    adress_id: 5,
    adresse: undefined,
    schulleitung_mail: 'boss@tu-wien.de',
    stubo_mail: 'info@tu-wien.de',
    schueleranzahl: 20000,
    kaoa_hochschule: true,
    talenscouting: true,
    ort: undefined
  }
];

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ZsbSchuleListDatasource extends DataSource<DataTableItem> {
  data: DataTableItem[];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private service: DatabaseService, private component: ZsbSchuleListComponent) {
    super();

    this.data = []; // init with empty data
    this.service.getSchulenComplete().subscribe(
      list => {
        this.data = list.map(item => {
          return {
            ...item
          };
        });

        // this should not be necessary or done in another way :/
        component.table.dataSource = this.data;
      });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the zsb-schule-list to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'schule_id':
          return compare(+a.schule_id, +b.schule_id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
