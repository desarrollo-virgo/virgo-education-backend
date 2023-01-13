import { GoogleSpreadsheet } from 'google-spreadsheet';
import configGoogle from '../../../configuration/virgo';

export class GoogleSheetClient {
  async getInfo() {
    const doc = new GoogleSpreadsheet(
      '1jemNKkEU3EFgeoQtLhnQuWyntIOuodjb1i64Gkx6WnY',
    );
    const client_email = configGoogle.client_email;
    const private_key = configGoogle.private_key;
    await doc.useServiceAccountAuth({
      client_email,
      private_key,
    });

    await doc.loadInfo();
    console.log(doc.title);
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    return rows;
  }
}
