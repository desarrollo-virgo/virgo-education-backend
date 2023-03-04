import { GoogleSpreadsheet } from 'google-spreadsheet';
import configGoogle from '../../../configuration/virgo';

export class GoogleSheetClient {
  async getInfo() {
    const doc = new GoogleSpreadsheet(
      '1Pl-Bc1F8LdcoKVjas4SgbF4ZC15y3l8U4mtcgJqCMX0',
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
