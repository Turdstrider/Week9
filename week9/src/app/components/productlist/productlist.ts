import { Component,input,inject,computed,signal, OnInit } from '@angular/core';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productlist',
  imports: [FormsModule],
  templateUrl: './productlist.html',
  styleUrl: './productlist.css'
})
export class Productlist implements OnInit  {
  productService = inject(ProductService);
  pageTitle = "Products";
  listCriteria = input.required();
  products = signal<Product[] >([]);

  proderror = signal<string>('');
  editingProduct = signal<Product | null>(null);
  addingProduct = signal<Product | null>(null);
  deletingProduct = signal<Product | null>(null);

  ngOnInit(): void {
   this.productService.loadProducts().subscribe({
    next: (data:Product[]) => this.products.set(data),
    error: (err:any) => this.proderror.set('Failed to fetch products')
  });
  }



  openEdit(product: Product) {
    // clone product so edits don't apply immediately
    this.editingProduct.set({ ...product });
  }
  openAdd() {
  // clone product so edits don't apply immediately
  let temp = new Product(0, "", "", 0, 0, "");
  this.addingProduct.set(temp);
  }
  saveAdd(){
    const added = this.addingProduct();
    if(!added) return;
      //add to database
      this.productService.addProd(added).subscribe((data)=>{
   
      if (!data.error){
        added._id = data.id;
        //update locallist
        this.products.update((prods)=>[...prods,added]);
        this.closeModal();
      }else{
        
        this.proderror.set("Duplicate product ID already exists");
      }
    }); 
  }

  saveEdit() {
    const edited = this.editingProduct();
    if (!edited) return;

    this.productService.updateProd(edited).subscribe((data) => {
      if (!data.error) {
        // Update the product list
        this.products.update((items) =>
          items.map((p) => (p._id === edited._id ? edited : p))
        );
        this.closeModal();
      } else {
        this.proderror.set("Duplicate product ID already exists");
      }
    });
  }

  closeModal() {
    this.editingProduct.set(null);
    this.addingProduct.set(null);
    this.deletingProduct.set(null);
    this.proderror.set('');
  }
  filteredProducts = computed(()=>{
    return this.products().filter((p:any) => p.name.includes(this.listCriteria()));
  });

  deleteProdConfirm(item:Product){
    this.deletingProduct.set({ ...item });
  }

  deleteProd(item:Product){
    
    this.productService.deleteProd(item).subscribe(()=>{
      this.products.update(products =>
      products.filter(p => p._id !== item._id));
      this.deletingProduct.set(null);
      this.closeModal();

    });  
  }

//end
}
