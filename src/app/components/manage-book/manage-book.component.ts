import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '@models/book/book.model';
import { FacadeService } from '@services/facade.service';
import { AppRoutes } from '@constants/routes';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    yearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    yearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-manage-book',
  templateUrl: './manage-book.component.html',
  styleUrls: ['./manage-book.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class ManageBookComponent implements OnInit {
  bookId = 0;
  book = new Book();
  get isEdit(): boolean {
    return this.bookId > 0;
  }
  get routes(): typeof AppRoutes {
    return AppRoutes;
  }
  currentYear = moment();
  date = new FormControl(moment(),[Validators.required, Validators.maxLength(4)]);
  bookForm = new FormGroup({
    title: new FormControl('',[Validators.required, Validators.minLength(4)]),
    authorName: new FormControl('',Validators.required),
    poster: new FormControl(''),
  });

  constructor(
    private facadeService: FacadeService,private activatedRoute: ActivatedRoute,
    private router: Router,private _snackBar: MatSnackBar ) {
    this.bookId = +(this.activatedRoute.snapshot.paramMap.get('id') ?? 0);
    console.log(this.bookId)
   }

  ngOnInit(): void {
    if (this.isEdit)
       this.getBook();
  }

  /**
   * get book by id
   *
   */
  getBook() {
    this.book = this.facadeService.bookService.get(this.bookId);
    this.bookForm.patchValue(this.book);
  }

   /**
   * get validation error message
   *
   * @param controlName
   */
   validateControlName(name:string) {
    const formControl = this.bookForm.get(name);
    if(formControl?.errors?.['required'])
              return 'This field is required';

    if(formControl?.errors?.['minlength'])
               return name + 'must be at least 4 characters long.';

    if(formControl?.errors?.['maxLength'])
    return name + 'must be 4 characters long.';

    return null;
  }

   /**
   * set year from datePicker
   *
   * @param normalizedYear
   * @param datepicker
   */
  setYear(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

/**
 * Save book
 *
 */
  onSubmit() {
    if (this.bookForm.invalid) return;
    this.book = this.bookForm.value;
    this.book.publishYear = this.date.value.year();

    if (this.isEdit) {
      this.book.id = this.bookId;
      this.facadeService.bookService.update(this.book);
    } else {
      this.facadeService.bookService.create(this.book);
    }
    this._snackBar.open("Book has been saved successfully", "OK",{
      duration: 3000
    });
    this.router.navigateByUrl(AppRoutes.BookList);
  }


}