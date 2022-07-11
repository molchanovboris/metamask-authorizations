import { Injectable, InjectionToken, Inject, OnDestroy, OnInit } from '@angular/core';
import { providers } from 'ethers';
import { Subject, takeUntil } from 'rxjs';
import { catchError, from, Observable, of, tap, map } from 'rxjs';

const MetaMaskKey = 'Metamask Provider';

type Window = {
  ethereum?: any;
}

export const MetaMaskProvider = new InjectionToken(
  MetaMaskKey,
  {
    providedIn: 'root',
    factory: () => (window as Window).ethereum
  }
);

@Injectable({
  providedIn: 'root'
})
export class MetaMaskService
  extends providers.Web3Provider
  implements OnInit, OnDestroy
{
  private account: string | null = null;
  private chainId: number | undefined;

  private _destroyed = new Subject<void>();

  get isMetaMask(): boolean {
    return Boolean(this.provider?.isMetaMask);
  }

  // @ts-ignore
  constructor(@Inject(MetaMaskProvider) metaMaskProvider) {
    super(metaMaskProvider);
  }

  connect(): void {
    this.enable().subscribe();
  }

  getAccount(): string | null {
    return this.account;
  }

  getChainId(): number | undefined {
    return this.chainId;
  }

  ngOnInit(): void {
    this.getProvider().on('accountsChanged', this.handleAccountChange);
    this.getProvider().on('connect', this.handleLogin);
    this.getProvider().on('disconnect', this.handleLogout);

    this.getProvider().on("chainChanged", this.handleNetworkChange);
    this.getProvider().on("networkChanged", this.handleNetworkChange);
  }

  ngOnDestroy(): void {
    this.getProvider().removeListener('accountsChanged', this.handleAccountChange);
    this.getProvider().removeListener('connect', this.handleLogin);
    this.getProvider().removeListener('disconnect', this.handleLogout);

    this.getProvider().removeListener("chainChanged", this.handleNetworkChange);
    this.getProvider().removeListener("networkChanged", this.handleNetworkChange);

    this._destroyed.next();
    this._destroyed.complete();
  }

  private handleLogin(): void {
    console.info("Connected");
  }

  private handleLogout(): void {
    console.info("Disconnected");
    this.account = null;
    this.chainId = undefined;
  }

  private handleAccountChange(accounts: string[]): void {
    if (accounts.length === 0) {
      console.info("Disconnected");
      this.account = null;
    } else {
      const currentAccount = accounts[0];
      console.info(`Connected: ${currentAccount}`);
      this.account = currentAccount;
    }
  }

  private handleNetworkChange(chainId: number): void {
    console.info(`Chain ID: ${chainId}`);
    this.chainId = chainId;
  }

  private getProvider(): any {
    return this.provider;
  }

  private enable(): Observable<string | null> {
    const isErrorWithMetaMask = !("enable" in this.provider);
    if (isErrorWithMetaMask) {
      return of(null);
    }
    return from(this.getProvider().enable())
      .pipe(
        // @ts-ignore
        takeUntil(this._destroyed),
        tap(this.handleAccountChange),
        map((accounts: string[]) => {
          this.account = accounts[0] || null;
          return this.account;
        }),
        catchError((err) => {
          console.error(err.message || "An error occurred, please try later.");
          return of(null);
        })
      )
  }
}
