import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { Productlist } from './productlist';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Productlist', () => {
  let component: Productlist;
  let fixture: ComponentFixture<Productlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productlist],
      providers:[ provideHttpClient(),
  provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
