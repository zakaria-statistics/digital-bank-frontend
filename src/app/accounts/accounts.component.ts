import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../model/account.model";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit{

  accountFormGroup!:FormGroup;
  currentPage:number=0;
  pageSize:number=4;
  accountObservable!:Observable<AccountDetails>;
  operationFormGroup!:FormGroup;
  errorMessage!:string;
  constructor(private fb:FormBuilder, private accountsService:AccountsService, public authService:AuthService) {
  }
  ngOnInit() {
    this.accountFormGroup=this.fb.group({
      accountId:this.fb.control('')
    })
    this.operationFormGroup=this.fb.group({
      operationType:this.fb.control(null),
      amount:this.fb.control(0),
      description:this.fb.control(null),
      accountDestination:this.fb.control(null)
    })
  }
  handleSearchAccount() {
    let accountId:string=this.accountFormGroup.value.accountId;
    this.accountObservable=this.accountsService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError( err=>{
        this.errorMessage=err.message;
        return throwError(err);
        }
      )
    )
  }
  goToPage(page: number) {
    this.currentPage=page;
    this.handleSearchAccount();
  }
  handleAccountOperation() {
    let accountId:string=this.accountFormGroup.value.accountId;
    let operationType:string=this.operationFormGroup.value.operationType;
    let description:string=this.operationFormGroup.value.description;
    let amount:number=this.operationFormGroup.value.amount;
    let accountDestination:string=this.operationFormGroup.value.accountDestination;
    if (operationType=='DEBIT'){
      this.accountsService.debit(accountId, amount, description).subscribe({
        next: (data)=>{
          alert("debit succeeded")
          this.handleSearchAccount();
        },error: (err)=>{
          console.log(err)
        }
      })
    }else if (operationType=='CREDIT'){
      this.accountsService.credit(accountId, amount, description).subscribe({
        next: (data)=>{
          alert("credit succeeded")
          this.handleSearchAccount();
        },error: (err)=>{
          console.log(err)
        }
      })
    }else {
      this.accountsService.transfer(accountId, accountDestination, amount).subscribe({
        next: (data)=>{
          alert("transfer succeeded"),
          this.handleSearchAccount()
        },error: (err)=>{
          console.log(err)
        }
      })
    }
    this.operationFormGroup.reset();
  }
}
