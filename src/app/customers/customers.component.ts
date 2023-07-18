import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {catchError, map, mapTo, Observable, throwError} from "rxjs";
import {Customer} from "../model/customer.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit{
  customers!: Observable<Customer[]>;
  errorMessage!:string;
  searchFormGroup!: FormGroup;
  constructor(private customerService:CustomerService, private fb:FormBuilder, private router:Router, public authService:AuthService) {
  }
  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword:this.fb.control("")
    });
    this.handleSearchCustomers();

  }

  handleSearchCustomers() {
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err);
      })
    )

  }

  handleDeleteCustomer(customer:Customer) {
    let conf=confirm("Are you sure?");
    if (!conf) return;
    this.customerService.deleteCustomer(customer.id).subscribe({
      next: (response) => {
        this.customers=this.customers.pipe(map(data=>{
          let index= data.indexOf(customer);
          data.slice(index,1)
          return data;
        })
        )
      },
      error: err => {
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/admin/customer-accounts/"+customer.id,{state:customer});
  }
}
