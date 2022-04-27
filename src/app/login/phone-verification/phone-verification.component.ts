import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';
import codes from 'country-calling-code';
import {CallingCode} from '../../types/callingCode';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.component.html',
  styleUrls: ['./phone-verification.component.scss'],
})
export class PhoneVerificationComponent implements OnInit {

  // The country codes for all countries.
  countryCodes: CallingCode[];

  // De countrycode that the user selected.
  code = '32';

  // The phone number
  phone: number;

  // True if the verification code has been sent.
  codeSent = false;

  // The verification code entered by the user.
  verificationCode: string;

  // True when the entered verification code was invalid.
  failed = false;

  // Used when this is the first login, the user must set a display name because
  // it can't be retrieved from a phone number. Google, Facebook, Twitter, ... don't require this.
  gettingDisplayName = false;

  // The chosen display name.
  displayName: string;

  constructor(private authService: AuthService, private modalController: ModalController) {
    // The country-calling-code library doesn't include types.
    this.countryCodes = codes.map(c => new CallingCode(c));
  }

  ngOnInit() {
  }

  /**
   * Send a verification code to the entered phone number.
   */
  async sendCode(): Promise<void> {
    await this.authService.sendPhoneVerificationCode(this.phoneNumber());
    this.codeSent = true;
    // Reset the process if the user hasn't entered anything in 5 minutes.
    setTimeout(() => this.reset(), 300000);
  }

  /**
   * Validate the entered code.
   */
  async validate(): Promise<void> {
    await this.authService.signInWithPhoneNumber(this.verificationCode);
    await this.handleFirstLogIn();
  }

  /**
   * Update the displayName.
   */
  async setUserName(): Promise<void> {
    await this.authService.updateDisplayName(this.displayName);
    await this.modalController.dismiss();
  }

  async dismissModal(): Promise<void> {
    await this.modalController.dismiss();
  }

  /**
   * Reset the form when the verification process fails or the user can't log in.
   *
   * @private
   */
  private reset(): void {
    this.verificationCode = undefined;
    this.failed = true;
    this.codeSent = false;
  }

  /**
   * Check if the displayName must be updated.
   */
  private async handleFirstLogIn(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    const displayName = this.authService.getDisplayName();
    if (displayName && displayName.length > 0) {
      await this.modalController.dismiss();
    } else {
      this.gettingDisplayName = true;
    }
  }

  /**
   * Retrieve the complete phone number.
   *
   * @private
   */
  private phoneNumber(): string {
    return `+${this.code}${this.phone}`;
  }
}
