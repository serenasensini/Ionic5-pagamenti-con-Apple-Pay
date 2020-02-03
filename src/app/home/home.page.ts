import { Component } from '@angular/core';
import { ApplePay } from '@ionic-native/apple-pay/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  prodotti: any = [
    {
      label: 'Pullover',
      amount: 12.99
    },
    {
      label: 'Consegna in un giorno',
      amount: 4.99
    },
  ];
  metodiSpedizione: any = [
    {
      identifier: '1-Giorno',
      label: '1-giorno',
      detail: 'Arrivo previsto entro le 18 del giorno successivo',
      amount: 4.99
    },
    {
      identifier: 'Standard',
      label: 'Standard',
      detail: '2-4 giorni lavorativi.',
      amount: 4.99
    },
    {
      identifier: 'Domenica',
      label: 'Consegna di domenica',
      detail: 'Arrivo entro le 13 di domenica.',
      amount: 6.99
    }
  ];
  circuiti: any = ['visa', 'amex'];
  carteAbilitate: any = ['3ds', 'debit', 'credit'];
  idMerchant = 'ionic.apple.test';
  monetaCorrente = 'EUR';
  codicePaese = 'IT';
  indirizzoFatturazione: any = ['nome', 'email', 'telefono'];
  indirizzoSpedizione: any = 'none';
  tipoSpedizione = 'corriere';
  constructor(private applePay: ApplePay, public alertController: AlertController) { }

  async verificaValidita() {
    await this.applePay.canMakePayments().then((message) => {
      console.log(message);
      this.presentAlert(message);
    }).catch((error) => {
      console.log(error);
      this.presentAlert(error);
    });
  }

  async effettuaPagamento() {
    try {
      const ordine: any = {
        items: this.prodotti,
        shippingMethods: this.metodiSpedizione,
        merchantIdentifier: this.idMerchant,
        currencyCode: this.monetaCorrente,
        countryCode: this.codicePaese,
        billingAddressRequirement: this.indirizzoFatturazione,
        shippingAddressRequirement: this.indirizzoSpedizione,
        shippingType: this.tipoSpedizione,
        merchantCapabilities: this.carteAbilitate,
        supportedNetworks: this.circuiti
      };
      this.applePay.makePaymentRequest(ordine).then(message => {
        console.log(message);
        // Nei pagamenti reali, bisogna aggiungere la chiamata al provider della banca desiderata
        // Provider.authorizeApplePayToken(token.paymentData)
        //    .then((captureStatus) => {
        //        ApplePay.completeLastTransaction('success');
        //    .catch((err) => {
        //        // Displays the 'failed' red cross.
        //        ApplePay.completeLastTransaction('failure');
        //    });
        this.applePay.completeLastTransaction('success');
      }).catch((error) => {
        console.log(error);
        this.applePay.completeLastTransaction('failure');
        this.presentAlert(error);
      });

    } catch {
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Apple Pay',
      subHeader: 'Stato del pagamento',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
