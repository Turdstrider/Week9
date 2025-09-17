import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting,HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../model/product';
import { environment } from '../../environments/environment';


describe('ProductService', () => {
  let service: ProductService;
  
  let httpMock: HttpTestingController;
  const mockProducts: Product[]= [
    {name: "VisionX Ultra HD 50" ,price:649},
    {name: "NovaScreen OLED 55" ,price:1299},
    {name:"CrystalView QLED 65" ,price:1799},
    {name: "LumaTech Smart 43",price: 429},
    {name: "AeroVision Curved 75" ,price:2499},
    {name: "Zenith Pro 4K 60",price:1099},
    {name: "BrightWave Mini 32" ,price:249},
    {name: "StellarView QLED 85" ,price:3299},
    {name: "ClearEdge HDR 48" ,price:599},
    {name: "PulseScreen UltraSlim 70",price:2099},
    {name: "Optima LED 40" ,price:379},
    {name: "HyperVision 8K 65" ,price:3899},
    {name: "StreamMaster Smart 58",price:879},
    {name: "QuantumGlow 4K 77" ,price:2899},
    {name: "Eclipse Black OLED 55",price:1499}
] as Product[];
const mockProduct: Product= {_id:'abc',name: "VisionX Ultra HD 50" ,price:649};


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    
  });

  afterEach(() => {
    httpMock.verify(); // ensure no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products via GET', () => {
    service.loadProducts().subscribe((data) => {
      expect(data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/getProdlist`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a product via POST', () => {
    const response = { success: true, id: 'abc123' };

    service.addProd(mockProduct).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/prod`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(response);
  });

  it('should update a product via PUT', () => {
    service.updateProd(mockProduct).subscribe((data) => {
      expect(data).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/prod`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should delete a product via DELETE with body', () => {
    service.deleteProd(mockProduct).subscribe((data) => {
      expect(data).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiServer}/api/prod`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });
});