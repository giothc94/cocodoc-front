import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoPDFComponent } from './ingreso-pdf.component';

describe('IngresoPDFComponent', () => {
  let component: IngresoPDFComponent;
  let fixture: ComponentFixture<IngresoPDFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoPDFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
