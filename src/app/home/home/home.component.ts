import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MetaMaskService } from 'src/app/services/metamask.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private metaMaskService: MetaMaskService
  ) { }

  ngOnInit(): void {
  }

  connect(): void {
    this.metaMaskService.connect();
  }

  isNotLocked(): boolean {
    return this.metaMaskService.getAccount() !== null;
  }

  getAccountAddress(): string | null {
    return this.metaMaskService.getAccount();
  }

  getNetworkId(): number | undefined {
    return this.metaMaskService.getChainId();
  }
}
