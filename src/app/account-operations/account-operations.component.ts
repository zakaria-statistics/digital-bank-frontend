import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountDetails} from "../model/account.model";
import {catchError, Observable, throwError} from "rxjs";
import {AccountsService} from "../services/accounts.service";

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
  constructor(private activatedRoute:ActivatedRoute, private router:Router, private accountsService:AccountsService) {
    this.accountId=this.activatedRoute.snapshot.params['id'];
    this.account=this.router.getCurrentNavigation()?.extras.state as AccountDetails;
    console.log(this.account);
  }
  ngOnInit() {
    this.handleSearchAccount();
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
}
