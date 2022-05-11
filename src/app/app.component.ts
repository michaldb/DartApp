import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { AuthService } from './services/auth.service';
import { Network } from '@capacitor/network';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  networkListener;
  loading: HTMLIonLoadingElement;

  constructor(firebaseApp: FirebaseApp, public authService: AuthService, public loadingController: LoadingController) {
  }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Trying to reconnect...'
    });

    Network.getStatus().then(x => {
      this.showReconnectMessage(x.connected);
    });

    this.networkListener = Network.addListener('networkStatusChange', status => {
      this.showReconnectMessage(status.connected);
    });
  }

  public async showReconnectMessage(connected): Promise<void> {
    if (!connected) {
      this.loading.present();
    } else {
      this.loading.dismiss();

      this.loading = await this.loadingController.create({
        message: 'Trying to reconnect...'
      });
    }
  }
}
