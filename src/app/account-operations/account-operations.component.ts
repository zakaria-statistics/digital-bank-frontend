import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountDetails} from "../model/account.model";
import {catchError, Observable, throwError} from "rxjs";
import {AccountsService} from "../services/accounts.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-account-operations',
  templateUrl: './account-operations.component.html',
  styleUrls: ['./account-operations.component.css']
})
export class AccountOperationsComponent implements OnInit{
  accountId!:string;
  currentPage:number=0;
  pageSize:number=4;
  account!:AccountDetails;
  messageError!:string;
  accountObservable!:AccountDetails;
  operationsFormGroup!:FormGroup;
  constructor(private activatedRoute:ActivatedRoute,
              private router:Router,
              private accountsService:AccountsService,
              private fb:FormBuilder,
              public authService:AuthService) {
    this.accountId=this.activatedRoute.snapshot.params['id'];
    //this.account=this.router.getCurrentNavigation()?.extras.state as AccountDetails;
  }
  ngOnInit() {
    this.handleSearchAccount();
    this.operationsFormGroup=this.fb.group({
      operationType:this.fb.control(null),
      amount:this.fb.control(0),
      description:this.fb.control(null),
      accountDestination:this.fb.control(null)
    })
  }
  handleSearchAccount(){
    this.accountsService.getAccount(this.accountId,this.currentPage,this.pageSize).subscribe({
      next:data=>{
        this.accountObservable=data;
      },
      error:err => {
        this.messageError=err.message;
      }
    })
  }


  goToPage(page: number) {
    this.currentPage=page;
    this.handleSearchAccount();

  }

  handleAccountOperations() {
    let accountId:string=this.accountId;
    let amount:number=this.operationsFormGroup.value.amount;
    let operationType:string=this.operationsFormGroup.value.operationType;
    let accountDestination:string=this.operationsFormGroup.value.accountDestination;
    let description:string=this.operationsFormGroup.value.description;
    if (operationType=='CREDIT'){
      this.accountsService.credit(accountId, amount, description).subscribe({
        next:value => {
          alert("operation succeeded");
          this.handleSearchAccount();
        },
        error:err => {
          console.log(err);
        }
      })
    } else if(operationType=='DEBIT'){
      this.accountsService.debit(accountId, amount, description).subscribe({
        next:value => {
          alert("operation succeeded");
          this.handleSearchAccount();
        },
        error:err => {
          console.log(err);
        }
      })
    }else{
      this.accountsService.transfer(accountId, accountDestination, amount).subscribe({
        next:value => {
          alert("operation succeeded");
          this.handleSearchAccount();
        },
        error:err => {
          console.log(err);
        }
      })
    }
  }
}
