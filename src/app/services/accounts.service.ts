import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {AccountDetails} from "../model/account.model";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http:HttpClient) { }
  public getAccount(accountId:string, page:number, size:number):Observable<AccountDetails>{
    return this.http.get<AccountDetails>(environment.backendHost+"/accounts/"+accountId+"/pageOperations?page="+page+"&size="+size);
  }
  public getCustomerAccounts(customerId:number):Observable<AccountDetails[]>{
    return this.http.get<AccountDetails[]>(environment.backendHost+"/customer-accounts/"+customerId);
  }
  public debit(accountId:string, amount:number, description:string){
    let data={accountId:accountId, amount:amount, description:description};
    return this.http.post(environment.backendHost+"/accounts/debit",data);
  }
  public credit(accountId:string, amount:number, description:string){
    let data={accountId, amount, description};
    return this.http.post(environment.backendHost+"/accounts/credit", data);
  }
  public transfer(accountSource:string, accountDestination:string, amount:number){
    let data={accountSource, accountDestination, amount};
    return this.http.post(environment.backendHost+"/accounts/transfer", data);
  }
}
