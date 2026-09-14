import { Injectable,resource,signal,inject} from '@angular/core';
import { Product,PRODUCTS } from '../model/product';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private http = inject(HttpClient);
  //products = signal<Product[]>(PRODUCTS);
  products = signal<Product[]>([]);


// constructor() {
//    // this.loadProducts();
//   }


loadProducts():Observable<Product[]> { //directly invokes the backend methods for database manipulation.

    return this.http.get<Product[]>(environment.apiServer+'/api/getProdlist');
  }

updateProd(product:Product){
    
    return this.http.put<any>(environment.apiServer+'/api/prod', product);
  }

addProd(product:Product){
    
    return this.http.post<any>(environment.apiServer+'/api/prod',  product );
  }
deleteProd(product:Product){
    let options = {body:product}
    return this.http.delete<Product>(environment.apiServer+'/api/prod', options );
  }
 

  
}
