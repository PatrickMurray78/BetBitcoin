import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BetbitcoinPage } from './betbitcoin.page';

describe('BetbitcoinPage', () => {
  let component: BetbitcoinPage;
  let fixture: ComponentFixture<BetbitcoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetbitcoinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BetbitcoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
